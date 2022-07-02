import { Box } from '@mui/material';
import * as React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { FilterHistoryEntry } from './components/filter-hisotry-entry/filter-history-entry.component';
import { FilterHistory } from './components/filter-history/filter-history.component';

import { TopBar } from './components/top-bar/top-bar.component';

const App: React.FunctionComponent = (): JSX.Element => {
    const [searchStr, setSearchStr] = React.useState('');

    React.useEffect(() => {
        // As we have nothing besides than the history:
        if (window.location.hash.indexOf('history') === -1) {
            window.location.replace(`${window.location.href}#/history`);
        }
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                height: '100vh',
            }}
        >
            <Box flex={0}>
                <TopBar onSearch={setSearchStr} />
            </Box>
            <Box flex={1} overflow="scroll">
                <Box sx={{ maxWidth: '800px', margin: 'auto' }}>
                    <HashRouter>
                        <Routes>
                            <Route
                                path="history"
                                element={
                                    <FilterHistory searchStr={searchStr} />
                                }
                            />
                            <Route
                                path="history/:id"
                                element={<FilterHistoryEntry />}
                            />
                        </Routes>
                    </HashRouter>
                </Box>
            </Box>
        </Box>
    );
};

export default App;
