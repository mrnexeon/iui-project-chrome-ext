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
        const yt_simple_endpoint = recommendation.querySelector('.yt-simple-endpoint');

        if (!yt_simple_endpoint) {
            continue;
        }

        // Extracts the video out of the href attribute
        const videoId = yt_simple_endpoint
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
 * Places a feedback button into recommended video block
 * @param element HTML element of the block
 */
const appendFeedbackButtons = (ids: string[]): void => {
    const recommendationsCollection = document.getElementsByTagName(
        'ytd-compact-video-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const recommendations = Array.from(recommendationsCollection);

    for (const recommendation of recommendations) {
        ////console.log(recommendation)

        // Extracts the video out of the href attribute
        const yt_simple_endpoint = recommendation.querySelector('.yt-simple-endpoint');

        if (!yt_simple_endpoint) {
            continue;
        }

        // Extracts the video out of the href attribute
        const videoId = yt_simple_endpoint
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

        let oldBtn = recommendation.querySelector('.youlearn-feedback-button')
        oldBtn?.remove(); // Remove button if was added before
        let feedback_button = document.createElement('button');
        feedback_button.className = 'youlearn-feedback-button';
        feedback_button.style.width = '30px';
        feedback_button.style.height = '30px';
        feedback_button.style.background = 'red';
        feedback_button.style.position = 'absolute';
        feedback_button.style.zIndex = '100';
        feedback_button.style.left = '4px';
        feedback_button.style.top = '4px';
        feedback_button.onclick = () => alert('Thank you for your feedback!');
        recommendation.appendChild(feedback_button);
    }
}

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
        ////console.log(recommendation)

        // Extracts the video out of the href attribute
        const yt_simple_endpoint = recommendation.querySelector('.yt-simple-endpoint');

        if (!yt_simple_endpoint) {
            continue;
        }

        // Extracts the video out of the href attribute
        const videoId = yt_simple_endpoint
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
    appendFeedbackButtons: appendFeedbackButtons
};
