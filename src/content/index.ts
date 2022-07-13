import { TopBanner } from '../components/top-banner.component';
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

    youtubeDom.ui.renderAboveNav(TopBanner);

    const videoListParent = await youtubeDom.recommendations.getParentElement();
    observeDOM(videoListParent as HTMLElement, async () => {
        const recommendedVideos = youtubeDom.recommendations.getVideos();
        const videosToFilter = recommendedVideos.filter(
            (v) => v.id.length > v.id.replace(/(a|b|1|2)/gm, '').length,
        );

        // TODO
        // API Logic goes HERE

        // REST API requests examples:

        // filterDistractfulVideos(['test1', 'test2']).then(distractful_ids => console.log(distractful_ids)).catch(err => console.error(err))
        // reportFeedback('test1', true).then(success => console.log(success)).catch(err => console.error(err))

        youtubeDom.recommendations.hide(videosToFilter.map((v) => v.id));
        youtubeDom.recommendations.hideMix();
        youtubeDom.recommendations.hideRelatedChipCloud();

        chromeStorage.filterHistory.saveForCurrentVideo(videosToFilter);
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
