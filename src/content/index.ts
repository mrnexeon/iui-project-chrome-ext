import { youtubeDom } from '../service/youtube-dom';
import { chromeStorage } from '../util/chrome-storage.util';
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

    const videoListParent = await youtubeDom.recommendations.getParentElement();
    observeDOM(videoListParent as HTMLElement, () => {
        const recommendedIds = youtubeDom.recommendations.getIds();

        // TODO
        // API Logic goes HERE

        // REST API requests examples:

        // filterEducationalVideos(['test1', 'test2']).then(educatonal_ids => console.log(educatonal_ids)).catch(err => console.error(err))
        // reportFeedback('test1', true).then(success => console.log(success)).catch(err => console.error(err))

        youtubeDom.recommendations.hide(recommendedIds);
    });
};

main();

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
    ].join();
    window.location.replace(url);
});
