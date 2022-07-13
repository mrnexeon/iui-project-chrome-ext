import { filterDistractfulVideos } from '../api/client';
import { TopBanner } from '../components/top-banner.component';
import { IFilterHistoryEntryVideo } from '../model/chrome-storage/stats.model';
import { youtubeDom } from '../service/youtube-dom';
import { chromeStorage } from '../util/chrome-storage';
import { observeDOM } from '../util/mutation-observer.util';
import { Mutex } from '../util/mutex.util';
import { isYoutubeWatchPage } from '../util/url-check.util';

const main = async () => {
    if (!isYoutubeWatchPage()) {
        return;
    }

    const isFilterEnabled = await chromeStorage.isFilterEnabled.get();
    if (!isFilterEnabled) {
        return;
    }

    youtubeDom.ui.renderAboveNav(TopBanner);

    const videoListParent = await youtubeDom.recommendations.getParentElement();

    const cache = {
        videosIds: { distractful: new Set(), allowed: new Set() },
    };

    const contentMutex = new Mutex('content-mutex');
    observeDOM(videoListParent as HTMLElement, async () => {
        contentMutex.acquire().then(async () => {
            const recommendedVideos = youtubeDom.recommendations.getVideos();

            const videosForHiding: IFilterHistoryEntryVideo[] = [],
                allowedVideos: IFilterHistoryEntryVideo[] = [],
                undecidedRecommendedVideos: IFilterHistoryEntryVideo[] = [];

            for (const recommendedVideo of recommendedVideos) {
                // Querying an id from the cache of videos that have been hidden before
                if (cache.videosIds.distractful.has(recommendedVideo.id))
                    continue;
                else if (cache.videosIds.allowed.has(recommendedVideo.id))
                    continue;

                undecidedRecommendedVideos.push(recommendedVideo);
            }

            const respondIds = new Set(
                await filterDistractfulVideos(
                    undecidedRecommendedVideos.map((v) => v.id),
                ),
            );

            console.log('past-req');

            for (const undecidedRecommendedVideo of undecidedRecommendedVideos) {
                if (respondIds.has(undecidedRecommendedVideo.id))
                    videosForHiding.push(undecidedRecommendedVideo);
                else allowedVideos.push(undecidedRecommendedVideo);
            }

            if (videosForHiding.length > 0)
                console.log(
                    new Set(videosForHiding.map((v) => v.id)),
                    ' ids have been hidden',
                );

            // Cache hidden videos in order to reduce REST API calls with duplicated ids
            videosForHiding.forEach((v) =>
                cache.videosIds.distractful.add(v.id),
            );

            youtubeDom.recommendations.hide(videosForHiding.map((v) => v.id));

            //youtubeDom.ui.appendFeedbackButtons(allowedVideos.map(v => v.id));

            chromeStorage.filterHistory.saveForCurrentVideo(videosForHiding);

            contentMutex.release();
        });
    });
};

main();
chromeStorage.filterHistory.get().then((r) => {
    console.log(r);
    console.log(JSON.stringify(r).length);
});

chromeStorage.isFilterEnabled.onChange(() => {
    if (!isYoutubeWatchPage()) {
        return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('t', `${Math.floor(youtubeDom.player.getTimestamp())}`);

    const url = [
        window.location.origin,
        window.location.pathname,
        '?',
        searchParams.toString(),
        's',
    ].join('');
    window.location.replace(url);
});
