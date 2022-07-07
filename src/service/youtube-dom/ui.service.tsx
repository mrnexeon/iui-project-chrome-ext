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

export const ui = {
    renderAboveNav: renderAboveNav,
};
