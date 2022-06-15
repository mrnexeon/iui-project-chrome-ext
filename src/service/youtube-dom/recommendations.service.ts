import _ from 'lodash';

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

    const videoIds: string[] = [];
    for (const recommendation of recommendations) {
        // Extracts the video out of the href attribute
        const videoId = recommendation.children[0].children[0].children[0]
            .getAttribute('href')
            ?.split('?')[1]
            .split('=')[1];
        if (!_.isUndefined(videoId)) {
            videoIds.push(videoId);
        }
    }

    return videoIds;
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
        const videoId = recommendation.children[0].children[0].children[0]
            .getAttribute('href')
            ?.split('?')[1]
            .split('=')[1];

        if (
            _.isUndefined(videoId) ||
            ids.indexOf(videoId) === -1 ||
            ids.indexOf(videoId) === -1
        ) {
            continue;
        }

        recommendation.style.display = 'none';
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
            const listOfParents = document.getElementsByTagName(
                'ytd-watch-next-secondary-results-renderer',
            ) as HTMLCollectionOf<HTMLElement>;

            if (listOfParents.length === 0) {
                setTimeout(getElement, 10);
                return;
            }

            const parent = listOfParents[0];
            resolve(parent);
        };
        getElement();
    });
};

export const recommendations = {
    getIds: getIds,
    hide: hide,
    getParentElement: getParentElement,
};
