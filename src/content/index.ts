import PQueue from 'p-queue';
import { filterDistractfulVideos } from '../api/client';
import { TopBanner } from '../components/top-banner.component';
import { IFilterHistoryEntryVideo } from '../model/chrome-storage/stats.model';
import { youtubeDom } from '../service/youtube-dom';
import { chromeStorage } from '../util/chrome-storage';
import { observeDOM } from '../util/mutation-observer.util';
import { isYoutubeWatchPage } from '../util/url-check.util';

const main = async () => {
    if (!isYoutubeWatchPage()) {
        return;
    }

    const isFilterEnabled = await chromeStorage.isFilterEnabled.get();
    if (!isFilterEnabled) {
        return;
    }

    const videoListParent = (await youtubeDom.recommendations.getParentElement())
    let promisesQueue = new PQueue({ concurrency: 1 });

    let cache = {
        videosIds: { distractful: new Set(), allowed: new Set() }
    }

    observeDOM(videoListParent as HTMLElement, () => {
        promisesQueue.clear();
        promisesQueue.add(async () => {
            youtubeDom.ui.renderAboveNav(TopBanner);

            const recommendedVideos = youtubeDom.recommendations.getVideos();

            let videosForHiding: IFilterHistoryEntryVideo[] = [],
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

            let respondIds = new Set(await filterDistractfulVideos(undecidedRecommendedVideos.map(v => v.id)))

            for (const undecidedRecommendedVideo of undecidedRecommendedVideos) {
                if (respondIds.has(undecidedRecommendedVideo.id))
                    videosForHiding.push(undecidedRecommendedVideo)
                else
                    allowedVideos.push(undecidedRecommendedVideo)
            }

            if (videosForHiding.length > 0)
                console.log(new Set(videosForHiding.map(v => v.id)), ' ids have been hidden');

            // Cache hidden videos in order to reduce REST API calls with duplicated ids
            videosForHiding.forEach(v => cache.videosIds.distractful.add(v.id));

            youtubeDom.recommendations.hide(videosForHiding.map(v => v.id));

            //youtubeDom.recommendations.appendFeedbackButtons(allowedVideos.map(v => v.id));

            chromeStorage.filterHistory.saveForCurrentVideo(videosForHiding);
        })
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
