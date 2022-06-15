import { youtubeDom } from '../service/youtube-manipulation.service';
import { chromeStorage } from '../util/chrome-storage.util';
import { observeDOM } from '../util/mutation-observer.util';
import { isYoutubeWatchPage } from '../util/url-check.util';

const filterRecommendations = async () => {
    if (!isYoutubeWatchPage()) {
        return;
    }

    const isFilterEnabled = await chromeStorage.isFilterEnabled.get();
    console.log('IsFilterEnabled:', isFilterEnabled);

    if (!isFilterEnabled) {
        return;
    }

    const videoListParents = document.getElementsByTagName(
        'ytd-watch-next-secondary-results-renderer',
    );

    if (videoListParents.length === 0) {
        setTimeout(() => filterRecommendations(), 100);
        return;
    }

    const videoListParent = videoListParents[0];

    observeDOM(videoListParent as HTMLElement, () => {
        const r = youtubeDom.getRecommendedIds();
        youtubeDom.hideRecommendations(r);
    });
};

filterRecommendations();
chromeStorage.isFilterEnabled.onChange(() => {
    window.location.reload();
});
