import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { render } from 'react-dom';
import { usePreferredTheme } from '../../hooks/theme.hook';
import App from './App';

const root = document.querySelector('#root');

const Index: React.FunctionComponent = (): JSX.Element => {
    const theme = usePreferredTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
};

render(<Index />, root);
