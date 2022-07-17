import { ThemeProvider } from '@emotion/react';
import { Link, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { usePreferredTheme } from '../hooks/theme.hook';
import { chromeStorage } from '../util/chrome-storage';

/**
 * Top Banner which informs user about enabled filtering
 *
 * @returns TopBanner
 */
export const TopBanner: React.FunctionComponent = (): JSX.Element => {
    const theme = usePreferredTheme();

    const setIsFilterEnabled = chromeStorage.isFilterEnabled.useValue()[1];

    const onTurnOffClick = () => {
        setIsFilterEnabled(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Paper
                sx={{
                    position: 'fixed',
                    top: 0,
                    zIndex: 1000,
                    width: '100vw',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 0,
                }}
                elevation={1}
            >
                <Typography
                    sx={{ marginRight: '10px', marginLeft: '30px' }}
                    variant="h5"
                >
                    💡&nbsp;
                </Typography>
                <Typography variant="h5" fontWeight={500}>
                    YouLearn&nbsp;
                </Typography>
                <Typography variant="h5" color="text.secondary">
                    - Distraction filtering is enabled
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ marginLeft: '15px', cursor: 'pointer' }}
                >
                    <Link onClick={onTurnOffClick}>Turn off</Link>
                </Typography>
            </Paper>
        </ThemeProvider>
    );
};
