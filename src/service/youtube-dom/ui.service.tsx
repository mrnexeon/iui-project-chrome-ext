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

export const ui = {
    renderAboveNav: renderAboveNav,
};
