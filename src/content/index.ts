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

    const videoListParent = (await youtubeDom.recommendations.getParentElement())

        .querySelector('#items'); // <- Hotfix. Description goes below.
        
        /*
            Hot fix: the element #items contains list of divs where each div is a recommended video. 
            Thus, we do observe changes on depth level 1, not 2. As a result, we can set option 
            subtree of MutationObserver to false and therefore add feedback buttons without triggering
            the observer.
        */

    console.log(videoListParent)
    observeDOM(videoListParent as HTMLElement, (mutations) => {
        const recommendedIds = youtubeDom.recommendations.getIds();

        // TODO
        // API Logic goes HERE

        // REST API requests examples:

        // filterDistractfulVideos(['test1', 'test2']).then(distractful_ids => console.log(distractful_ids)).catch(err => console.error(err))
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
    ].join('');
    window.location.replace(url);
});
