import { ArrowBack } from '@mui/icons-material';
import { CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportFeedback } from '../../../../api/client';
import * as chromeStorage from '../../../../util/chrome-storage';
import { FilterHistoryEntryVideo } from './filter-history-entry-video.component';

/**
 * FilterHistoryEntry shows the filtered videos of a history entry
 * Gets ID of entry over HashRouter
 *
 * @returns
 */
export const FilterHistoryEntry: React.FunctionComponent = (): JSX.Element => {
    // Routing related
    const navigate = useNavigate();
    const params = useParams();

    const filterHistory = chromeStorage.filterHistory.useValue();
    const currentEntry = React.useMemo(
        () => filterHistory.filter((e) => e.sessionId === params.id)[0],
        [params, filterHistory],
    );

    const onMarkDistractingClick = async (id: string) => {
        // TODO put feedback API calls here

        const response = await reportFeedback(id, false);

        console.debug('Feedback has been sent!', { id, response });
    };

    return (
        <>
            {_.isUndefined(currentEntry) ? (
                // Loading animation while filterHistoryEntry is not available
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ) : (
                <Stack
                    sx={{
                        margin: '30px 0 30px 0',
                    }}
                    spacing={2}
                >
                    <Box display="flex">
                        <Box sx={{ width: '60px', position: 'relative' }}>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translate(0, -50%)',
                                }}
                                onClick={() => navigate('../history')}
                            >
                                <ArrowBack fontSize="large" />
                            </IconButton>
                        </Box>
                        <Box>
                            <Typography variant="h6">
                                {`${currentEntry.sourceVideo.title} - ${currentEntry.sourceVideo.channelName}`}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                            >
                                While you watched this video we have hidden the
                                following videos
                            </Typography>
                        </Box>
                    </Box>
                    {currentEntry.filteredVideos.map((entry, index) => (
                        <FilterHistoryEntryVideo
                            key={`filter-history-entry-${index}`}
                            video={entry}
                            onMarkDistractingClick={async () =>
                                await onMarkDistractingClick(entry.id)
                            }
                        />
                    ))}
                </Stack>
            )}
        </>
    );
};
