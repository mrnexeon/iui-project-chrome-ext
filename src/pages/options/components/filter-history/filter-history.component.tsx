import { Stack, Typography } from '@mui/material';
import * as React from 'react';
import { chromeStorage } from '../../../../util/chrome-storage';

import { FilterHistoryEntry } from './filter-history-entry.component';

/**
 * List of FilterHistoryEntries
 *
 * @returns FilterHistory Component
 */
export const FilterHistory: React.FunctionComponent = (): JSX.Element => {
    const filterHistory = chromeStorage.filterHistory.useValue();

    return (
        <Stack
            sx={{
                maxWidth: '800px',
                margin: 'auto',
                marginTop: '30px',
            }}
            spacing={2}
        >
            <Typography variant="subtitle1" color="text.secondary">
                Filter History
            </Typography>
            {filterHistory.map((entry, index) => (
                <>
                    <FilterHistoryEntry
                        key={`filter-history-entry-${index}`}
                        video={entry.sourceVideo}
                        timestamp={entry.utcDate}
                    />
                    <Typography variant="subtitle2">
                        {entry.filteredVideos.map((v) => v.title).join(', ')}
                    </Typography>
                </>
            ))}
        </Stack>
    );
};
