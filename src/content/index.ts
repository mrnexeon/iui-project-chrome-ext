import { filterDistractfulVideos } from '../api/client';
import { FeedbackButton } from '../components/feedback-button.component';
import { TopBanner } from '../components/top-banner.component';
import { IFilterHistoryEntryVideo } from '../model/chrome-storage/stats.model';
import * as youtubeDom from '../service/youtube-dom';
import * as chromeStorage from '../util/chrome-storage';
import { observeDOM } from '../util/mutation-observer.util';
import { Mutex } from '../util/mutex.util';
import { isYoutubeWatchPage } from '../util/url-check.util';

const contentMutex = new Mutex('content-mutex');

/**
 * Entry point for filter related actions
 */
const main = async () => {
    if (!isYoutubeWatchPage()) {
        return;
    }

    const isFilterEnabled = await chromeStorage.isFilterEnabled.get();
    if (!isFilterEnabled) {
        return;
    }

    youtubeDom.ui.renderAboveNav(TopBanner);

    const filterCache = {
        distractful: new Set<string>(),
        allowed: new Set<string>(),
    };
    chromeStorage.hiddenVideos.onChange(() =>
        chromeStorage.hiddenVideos
            .get()
            .then((hiddenVideos) =>
                hiddenVideos.forEach((v) => filterCache.distractful.add(v)),
            ),
    );

    const videoListParent = await youtubeDom.recommendations.getParentElement();
    observeDOM(videoListParent as HTMLElement, async () => {
        contentMutex.acquire().then(async () => {
            const recommendedVideos = youtubeDom.recommendations.getVideos();

            const videosToAnalyze: IFilterHistoryEntryVideo[] =
                recommendedVideos.filter(
                    (v) =>
                        !filterCache.distractful.has(v.id) &&
                        !filterCache.allowed.has(v.id),
                );

            const responseIds = await filterDistractfulVideos(
                videosToAnalyze.map((v) => v.id),
            );

            for (const videoToAnalyze of videosToAnalyze) {
                if (responseIds.indexOf(videoToAnalyze.id) > -1) {
                    filterCache.distractful.add(videoToAnalyze.id);
                } else {
                    filterCache.allowed.add(videoToAnalyze.id);
                }
            }

            const videoIdsToHide = Array.from(filterCache.distractful);

            youtubeDom.recommendations.hide(videoIdsToHide);
            youtubeDom.recommendations.hideMix();
            youtubeDom.recommendations.hideRelatedChipCloud();

            youtubeDom.ui.appendFeedbackButtons(FeedbackButton);

            chromeStorage.filterHistory.saveForCurrentVideo(
                recommendedVideos.filter((e) =>
                    filterCache.distractful.has(e.id),
                ),
            );

            contentMutex.release();
        });
    });
};

main();
chromeStorage.hiddenVideos.get().then(console.log);

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
