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

        youtubeDom.recommendations.hide(recommendedIds);
    });
};

main();

chromeStorage.isFilterEnabled.onChange(() => {
    if (!isYoutubeWatchPage()) {
        return;
    }

    window.location.reload();
});
