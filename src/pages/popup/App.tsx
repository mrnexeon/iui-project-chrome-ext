import {
    Box,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { usePreferredTheme } from '../../hooks/theme.hook';
import * as chromeStorage from '../../util/chrome-storage';
import { TopBar } from './components/top-bar.component';

const App = (): JSX.Element => {
    const theme = usePreferredTheme();

    const [isFilterEnabled, setIsFilterEnabled] =
        chromeStorage.isFilterEnabled.useValue();

    const onToggleClick = React.useCallback((e) => {
        setIsFilterEnabled(e.target.checked);
    }, []);

    const [threshold, setThreshold] = chromeStorage.filterThreshold.useValue();

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
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="threshold-selector">
                        Filter Level
                    </InputLabel>
                    <Select
                        labelId="threshold-selector"
                        id="threshold-selector-select"
                        value={threshold}
                        label="Filter Level"
                        onChange={(e) =>
                            _.isNumber(e.target.value)
                                ? setThreshold(e.target.value)
                                : void 0
                        }
                    >
                        <MenuItem value={0.5}>Light</MenuItem>
                        <MenuItem value={0.7}>Medium</MenuItem>
                        <MenuItem value={0.9}>Heavy</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>
    );
};

export default App;
