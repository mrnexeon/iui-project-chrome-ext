import { createTheme, Theme } from '@mui/material';
import * as React from 'react';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

/**
 * Checks the user's preferred mode and returns a mui theme accordingly
 * Will update when when mode changes
 *
 * @returns Theme theme in dark or light mode
 */
export const usePreferredTheme = (): Theme => {
    const [theme, setTheme] = React.useState(lightTheme);

    React.useEffect(() => {
        const isDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        setTheme(isDarkMode ? darkTheme : lightTheme);

        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                setTheme(e.matches ? darkTheme : lightTheme);
            });
    }, []);

    return theme;
};
