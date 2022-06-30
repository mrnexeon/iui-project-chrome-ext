import { Box } from '@mui/material';
import * as React from 'react';
import { FilterHistory } from './components/filter-history/filter-history.component';

import { TopBar } from './components/top-bar/top-bar.component';

const App: React.FunctionComponent = (): JSX.Element => {
    React.useEffect(() => {
        history.pushState('', '', '/');
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
                <TopBar />
            </Box>
            <Box flex={1} overflow="scroll">
                <FilterHistory />
            </Box>
        </Box>
    );
};

export default App;
