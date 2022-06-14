import _ from 'lodash';
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

    // re := recommendations

    const videoListParents = document.getElementsByTagName(
        'ytd-watch-next-secondary-results-renderer',
    );

    if (videoListParents.length === 0) {
        setTimeout(() => filterRecommendations(), 100);
        return;
    }

    const videoListParent = videoListParents[0];

    console.log('parent', JSON.stringify(videoListParent));

    observeDOM(videoListParent as HTMLElement, () => {
        const allResCollection = document.getElementsByTagName(
            'ytd-compact-video-renderer',
        );

        const allRes = Array.from(
            allResCollection as HTMLCollectionOf<HTMLElement>,
        );

        const resToFilter = allRes.filter((e) => {
            const videoId = e.children[0].children[0].children[0]
                .getAttribute('href')
                ?.split('?')[1];

            if (!_.isUndefined(videoId)) {
                return videoId.split('=')[1].indexOf('') > -1;
            }

            return false;
        });

        console.log(resToFilter);

        for (const e of allRes) {
            e.style.display = 'none';
        }
    });
};

filterRecommendations();
chromeStorage.isFilterEnabled.onChange(() => {
    window.location.reload();
});
