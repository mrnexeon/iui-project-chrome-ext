import { filterDistractfulVideos } from '../api/client';
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
    observeDOM(videoListParent as HTMLElement, async (mutations) => {
        const recommendedIds = youtubeDom.recommendations.getIds();

        // TODO
        // API Logic goes HERE

        // REST API requests examples:

        // filterDistractfulVideos(['test1', 'test2']).then(distractful_ids => console.log(distractful_ids)).catch(err => console.error(err))
        // reportFeedback('test1', true).then(success => console.log(success)).catch(err => console.error(err))

        let unresolvedVideoIds = [], distractfulVideoIds = []//, passedVideoIds = [];

        console.log({ ...youtubeDom.cache })

        for (const id of recommendedIds) {

            // Querying an id from the cache of videos that have been hidden before
            if (youtubeDom.cache.hiddenIds.has(id)) {
                distractfulVideoIds.push(id);
            } else {
                unresolvedVideoIds.push(id);
            }
        }

        const distractful_ids = await filterDistractfulVideos(unresolvedVideoIds);
        console.log({ distractful_ids });

        distractfulVideoIds.push(...distractful_ids)

        /*
        for (const id of recommendedIds) {

            // Querying an id from the cache of videos that have been hidden before
            if (youtubeDom.cache.hiddenIds.has(id)) {
                distractfulVideoIds.push(id)
                continue;
            }

            try {
                const distractful_ids = await filterDistractfulVideos([id])

                console.log({distractful_ids});

                if (distractful_ids.includes(id)) {
                    distractfulVideoIds.push(id)
                    continue;
                }
            }
            catch(e) {
                console.error(e)
            }

            if (!(/^\d+$/.test(id))) { // Randomizer: It skips videos which ids starts on the digit.
                distractfulVideoIds.push(id)
                continue;
            }
            
            passedVideoIds.push(id)
        }
        */

        // Cache hidden videos in order to reduce REST API calls with duplicated ids
        distractfulVideoIds.forEach(id => youtubeDom.cache.hiddenIds.add(id));

        console.log({ ...youtubeDom.cache, distractfulVideoIds });

        youtubeDom.recommendations.hide(distractfulVideoIds);

        //youtubeDom.recommendations.appendFeedbackButtons(passedVideoIds);
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
