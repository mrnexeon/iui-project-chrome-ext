import _ from 'lodash';
import { IFilterHistoryEntryVideo } from '../../model/chrome-storage/stats.model';

/**
 * Extracts the recommended video IDs from the youtube DOM
 *
 * @returns list of video IDs
 */
const getIds = (): string[] => {
    const recommendationsCollection = document.getElementsByTagName(
        'ytd-compact-video-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const recommendations = Array.from(recommendationsCollection);

    const ids: string[] = [];
    for (const recommendation of recommendations) {
        const yt_simple_endpoint = recommendation.querySelector(
            '.yt-simple-endpoint',
        );

        if (_.isNull(yt_simple_endpoint)) {
            continue;
        }

        // Extracts the video out of the href attribute
        const params = new URLSearchParams(
            yt_simple_endpoint.getAttribute('href')?.split('?')[1],
        );
        const id = params.get('v');

        if (!_.isNull(id) && recommendation.style.display !== 'none') {
            ids.push(id);
        }
    }

    return ids;
};

/**
 * Extracts the recommended videos
 *
 * @returns list of videos with ids, titles and channel names
 */
const getVideos = (): IFilterHistoryEntryVideo[] => {
    const recommendationsCollection = document.getElementsByTagName(
        'ytd-compact-video-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const recommendations = Array.from(recommendationsCollection);

    const videos: IFilterHistoryEntryVideo[] = [];
    for (const recommendation of recommendations) {
        // Extracts the video out of the href attribute
        const yt_simple_endpoint = recommendation.querySelector(
            '.yt-simple-endpoint',
        );

        if (_.isNull(yt_simple_endpoint)) {
            continue;
        }

        // Extracts the video out of the href attribute
        const params = new URLSearchParams(
            yt_simple_endpoint.getAttribute('href')?.split('?')[1],
        );
        const id = params.get('v');

        console.log(id);

        const title =
            recommendation.children[0].children[1].children[0].children[0]
                .children[0].children[1].textContent;

        const channelName =
            recommendation.children[0].children[1].children[0].children[0]
                .children[1].children[0].children[0].children[0].children[0]
                .children[0].children[0].children[0].textContent;

        if (!_.isNull(id) && recommendation.style.display !== 'none')
            videos.push({
                id: id,
                // Leading and trailing whitespace has to be replaced
                title: (title ?? '').replace(/(^\s*|\s*$)/gm, ''),
                channelName: (channelName ?? '').replace(/(^\s*|\s*$)/gm, ''),
            });
    }

    return videos;
};

/**
 * Gives all recommendations with their id present in ids the css property
 * display: none
 *
 * @param ids Video IDs of recommendations to be hidden
 */
const hide = (ids: string[]): void => {
    const recommendationsCollection = document.getElementsByTagName(
        'ytd-compact-video-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const recommendations = Array.from(recommendationsCollection);

    for (const recommendation of recommendations) {
        // Extracts the video out of the href attribute
        const yt_simple_endpoint = recommendation.querySelector(
            '.yt-simple-endpoint',
        );

        if (_.isNull(yt_simple_endpoint)) {
            continue;
        }

        // Extracts the video out of the href attribute
        const params = new URLSearchParams(
            yt_simple_endpoint.getAttribute('href')?.split('?')[1],
        );
        const videoId = params.get('v');

        if (
            _.isNull(videoId) ||
            ids.indexOf(videoId) === -1 ||
            recommendation.style.display === 'none'
        ) {
            continue;
        }

        recommendation.style.display = 'none';
    }
};

/**
 * Hides YouTube's radio station recommendations
 */
const hideMix = (): void => {
    const mixes = Array.from(
        document.getElementsByTagName(
            'ytd-compact-radio-renderer',
        ) as HTMLCollectionOf<HTMLElement>,
    );

    for (const mix of mixes) {
        mix.style.display = 'none';
    }
};

/**
 * Hides YouTube's related chip cloud renderer
 */
const hideRelatedChipCloud = (): void => {
    const chipClouds = Array.from(
        document.getElementsByTagName(
            'yt-related-chip-cloud-renderer',
        ) as HTMLCollectionOf<HTMLElement>,
    );

    for (const chipCloud of chipClouds) {
        chipCloud.style.display = 'none';
    }
};

/**
 * Gets the parent element of the recommendations async
 *
 * @returns A promise which resolves with HTML Element
 */
const getParentElement = (): Promise<HTMLElement> => {
    return new Promise<HTMLElement>((resolve) => {
        const getElement = () => {
            const children = document.getElementsByTagName(
                'ytd-compact-video-renderer',
            ) as HTMLCollectionOf<HTMLElement>;

            if (children.length === 0) {
                setTimeout(getElement, 10);
                return;
            }

            const parent = children[0].parentElement;

            if (_.isNull(parent)) {
                setTimeout(getElement, 10);
                return;
            }

            console.log(parent);
            resolve(parent);
        };
        getElement();
    });
};

export const recommendations = {
    getIds: getIds,
    getVideos: getVideos,
    hide: hide,
    hideMix: hideMix,
    hideRelatedChipCloud: hideRelatedChipCloud,
    getParentElement: getParentElement,
};
