import {
    Box,
    CssBaseline,
    FormControlLabel,
    Switch,
    ThemeProvider,
    Typography
} from '@mui/material';
import React from 'react';
import { usePreferredTheme } from '../../hooks/theme.hook';
import { chromeStorage } from '../../util/chrome-storage.util';

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
                {/*
                REST API requests examples
                <p><button onClick={() => filterVideos(['test1', 'test2']).then(res => res.json()).catch(err => console.error(err)).then(json => console.log('Filter Videos', json)).catch(err => console.error(err))}>Filter Videos</button></p>
                <p><button onClick={() => postFeedback('test123', true).then(res => console.log('Give Feedback', res.status)).catch(err => console.error(err))}>Give Feedback</button></p>
                */}
            </Box>
        </ThemeProvider>
    );
};

export default App;
