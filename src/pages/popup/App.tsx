import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import React from 'react';
import { usePreferredTheme } from '../../hooks/theme.hook';
import { chromeStorage } from '../../util/chrome-storage';
import { TopBar } from './components/top-bar.component';

import { filterDistractfulVideos } from '../../api/client';

const App = (): JSX.Element => {
    const theme = usePreferredTheme();

    const [isFilterEnabled, setIsFilterEnabled] =
        chromeStorage.isFilterEnabled.useValue();

    const onToggleClick = React.useCallback((e) => {
        setIsFilterEnabled(e.target.checked);
    }, []);

    return (
        <>
            <TopBar />
            <Box
                sx={{
                    minWidth: '300px',
                    backgroundColor: theme.palette.background.default,
                    padding: '15px',
                }}
                textAlign="center"
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={isFilterEnabled}
                            onClick={onToggleClick}
                        />
                    }
                    label="Filter Recommendations"
                />
                <p><button onClick={() => filterDistractfulVideos(["YBN4xI3Z-lc", "gx8_iBO6Sig", "K-MFoZNtt2s", "OmaFy0NKTss"]).then(res => console.log(res)).catch(err => console.error(err))}>Filter Videos</button></p>
            </Box>
            <Button
                onClick={() => {
                    chrome.storage.local.remove('filter-history');
                }}
            >
                Clear History
            </Button>
        </>
    );
};

export default App;
