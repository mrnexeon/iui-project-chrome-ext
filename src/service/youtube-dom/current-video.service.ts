import { IFilterHistoryEntryVideo } from '../../model/chrome-storage/stats.model';

/**
 * Returns id, title and channelName of the video that is currently playing
 *
 * @returns IFilterHistoryEntryVideo obj containing id, title and channelName
 */
const get = (): IFilterHistoryEntryVideo => {
    // Video Id
    const searchParams = new URLSearchParams(window.location.search);
    const videoId = searchParams.get('v') ?? '';

    // Video Title
    const videoTitleCollection = document.getElementsByTagName(
        'ytd-video-primary-info-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const videoTitle =
        videoTitleCollection[0].children[0].children[3].children[0].textContent?.replace(
            /(^\s*|\s*$)/gm,
            '',
        );

    // Channel Name
    const channelNameCollection = document.getElementsByTagName(
        'ytd-video-owner-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const channelName =
        channelNameCollection[0].children[1].children[0].children[0].children[0].children[0].children[0].textContent?.replace(
            /(^\s*|\s*$)/gm,
            '',
        );

    return {
        id: videoId,
        title: videoTitle ?? '',
        channelName: channelName ?? '',
    };
};

export const currentVideo = {
    get: get,
};
