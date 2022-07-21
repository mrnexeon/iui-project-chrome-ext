import _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';

/**
 * Renders the given component above the youtube navbar
 * NOTE: The functions creates 30px of space
 *
 * @param Component Component to render above youtube nav
 */
const renderAboveNav = async (
    Component: React.FunctionComponent,
): Promise<void> => {
    const ytdApp = (
        document.getElementsByTagName(
            'ytd-app',
        ) as HTMLCollectionOf<HTMLElement>
    )[0];
    const mastheadContainer = document.getElementById(
        'masthead-container',
    ) as HTMLElement;

    if (
        _.isUndefined(ytdApp) ||
        _.isNull(ytdApp) ||
        _.isUndefined(mastheadContainer) ||
        _.isNull(mastheadContainer)
    ) {
        setTimeout(() => renderAboveNav(Component), 500);
        return;
    }

    ytdApp.style.marginTop = '30px';
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
 */
const renderInRecommendationMenu = (
    Component: React.FunctionComponent<{ id: string }>,
): void => {
    const recommendationsCollection = document.getElementsByTagName(
        'ytd-compact-video-renderer',
    ) as HTMLCollectionOf<HTMLElement>;
    const recommendations = Array.from(recommendationsCollection);

    for (const recommendation of recommendations) {
        if (recommendation.style.display === 'none') {
            continue;
        }

        const id = recommendation.children[0].children[0].children[0]
            .getAttribute('href')
            ?.split('?')[1]
            .split('=')[1];

        const oldButton = recommendation.querySelector(
            '.youlearn-feedback-button',
        );
        if (!_.isNull(oldButton) || _.isUndefined(id)) {
            continue;
        }

        const feedback_button = document.createElement('div');
        feedback_button.className = 'youlearn-feedback-button';

        const ytdMenuRenderer = recommendation.querySelector(
            'ytd-menu-renderer',
        ) as HTMLElement;
        ytdMenuRenderer.style.flexDirection = 'column';

        ytdMenuRenderer.appendChild(feedback_button);
        render(<Component id={id} />, feedback_button);
    }
};

export const ui = {
    renderAboveNav: renderAboveNav,
    appendFeedbackButtons: renderInRecommendationMenu,
};
