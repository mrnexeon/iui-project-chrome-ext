import _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';

/**
 * Renders the given component above the youtube navbar
 * NOTE: The functions creates 30px of space
 *
 * @param Component Component to render above youtube nav
 */
const renderAboveNav = (Component: React.FunctionComponent): void => {
    const ytdApp = (
        document.getElementsByTagName(
            'ytd-app',
        ) as HTMLCollectionOf<HTMLElement>
    )[0];
    ytdApp.style.marginTop = '30px';

    const mastheadContainer = document.getElementById(
        'masthead-container',
    ) as HTMLElement;
    mastheadContainer.style.top = '30px';

    const el = document.createElement('div');
    el.id = 'youlearn-banner';
    (
        document.getElementsByTagName('body') as HTMLCollectionOf<HTMLElement>
    )[0].appendChild(el);

    render(<Component />, el);
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

        // Extracts the video out of the href attribute
        const yt_simple_endpoint = recommendation.querySelector('.yt-simple-endpoint');

        if (_.isNull(yt_simple_endpoint)) {
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

        const oldBtn = recommendation.querySelector('.youlearn-feedback-button')
        oldBtn?.remove(); // Remove button if was added before
        const feedback_button = document.createElement('button');
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

export const ui = {
    renderAboveNav: renderAboveNav,
    appendFeedbackButtons: appendFeedbackButtons
};
