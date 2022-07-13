import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { IFilterHistoryEntry } from '../../../../model/chrome-storage/stats.model';
import * as chromeStorage from '../../../../util/chrome-storage';
import { FilterHistoryVideo } from './filter-history-video.component';

/**
 * List of FilterHistoryEntries
 *
 * @returns FilterHistory Component
 */
export const FilterHistory: React.FunctionComponent = (): JSX.Element => {
    // Routing related
    const navigate = useNavigate();

    const filterHistory = chromeStorage.filterHistory.useValue();

    const groupedFilterHistory: [
        IFilterHistoryEntry,
        ...IFilterHistoryEntry[],
    ][] = React.useMemo(() => {
        const grouped: [IFilterHistoryEntry, ...IFilterHistoryEntry[]][] = [];

        for (const entry of filterHistory) {
            const last = grouped[grouped.length - 1];
            if (
                !_.isUndefined(last) &&
                last.length > 0 &&
                last[0].sourceVideo.id === entry.sourceVideo.id
            ) {
                last.push(entry);
                continue;
            }

            grouped.push([entry]);
        }

        return grouped;
    }, [filterHistory]);

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
            {groupedFilterHistory.length === 0 && (
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ width: '100%', marginTop: '30px' }}
                    textAlign="center"
                >
                    Nothing to see here
                </Typography>
            )}
            {groupedFilterHistory.map((entries, index) => (
                <FilterHistoryVideo
                    key={`filter-history-entry-${index}`}
                    entries={entries}
                    onClick={navigate}
                />
            ))}
        </Stack>
    );
};
