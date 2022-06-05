import {
    Box,
    CssBaseline,
    FormControlLabel,
    Switch,
    ThemeProvider,
    Typography,
} from '@mui/material';
import React from 'react';
import { usePreferredTheme } from '../../hooks/theme.hook';

const App = (): JSX.Element => {
    const theme = usePreferredTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minWidth: '300px',
                    backgroundColor: theme.palette.background.default,
                    padding: '15px',
                }}
                textAlign="center"
            >
                <Typography variant="h4">YouLearn</Typography>
                <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Filter Recommendations"
                />
            </Box>
        </ThemeProvider>
    );
};

export default App;
