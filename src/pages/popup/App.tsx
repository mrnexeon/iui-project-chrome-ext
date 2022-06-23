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
import { chromeStorage } from '../../util/chrome-storage';

const App = (): JSX.Element => {
    const theme = usePreferredTheme();

    const [isFilterEnabled, setIsFilterEnabled] =
        chromeStorage.isFilterEnabled.useValue();

    const onToggleClick = React.useCallback((e) => {
        setIsFilterEnabled(e.target.checked);
    }, []);

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
                    control={
                        <Switch
                            checked={isFilterEnabled}
                            onClick={onToggleClick}
                        />
                    }
                    label="Filter Recommendations"
                />
            </Box>
        </ThemeProvider>
    );
};

export default App;
