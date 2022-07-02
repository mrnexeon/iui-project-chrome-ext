import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { chromeStorage } from '../../../../util/chrome-storage';
import { stringUtil } from '../../../../util/string.utilt';
import { FilterHistoryVideo } from './filter-history-video.component';

interface IProps {
    searchStr?: string;
}

/**
 * List of FilterHistoryEntries
 *
 * @returns FilterHistory Component
 */
export const FilterHistory: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    // Routing related
    const navigate = useNavigate();

    const filterHistory = chromeStorage.filterHistory.useValue();
    const filteredFilterHistory = React.useMemo(() => {
        // Filter filterHistory by search query
        const str = props.searchStr;
        if (_.isUndefined(str) || str === '') {
            return filterHistory;
        }
        return filterHistory.filter(
            (e) =>
                stringUtil
                    .normalize(e.sourceVideo.title)
                    .indexOf(stringUtil.normalize(str)) > -1 ||
                stringUtil
                    .normalize(e.sourceVideo.channelName)
                    .indexOf(stringUtil.normalize(str)) > -1,
        );
    }, [props.searchStr, filterHistory]);

    return (
        <Stack
            sx={{
                margin: '30px 0 30px 0',
            }}
            spacing={2}
        >
            <Box>
                <Typography variant="h5">Watch history</Typography>
                <Typography variant="h6" color="text.secondary">
                    While filtering was enabled
                </Typography>
            </Box>
            {filteredFilterHistory.length === 0 && (
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ width: '100%', marginTop: '30px' }}
                    textAlign="center"
                >
                    Nothing to see here
                </Typography>
            )}
            {filteredFilterHistory.map((entry, index) => (
                <FilterHistoryVideo
                    key={`filter-history-entry-${index}`}
                    entry={entry}
                    onClick={() => navigate(entry.sessionId)}
                />
            ))}
        </Stack>
    );
};
