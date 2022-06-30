import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import * as React from 'react';
import { IFilterHistoryEntryVideo } from '../../../../model/chrome-storage/stats.model';

interface IProps {
    video: IFilterHistoryEntryVideo;
    timestamp: string;
}

/**
 * Single Filter Entry, that is video with thumbnail, title etc.
 *
 * @param props Props
 * @returns FilterHistoryEntry Component
 */
export const FilterHistoryEntry: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    return (
        <Card sx={{ display: 'flex' }}>
            <CardMedia
                component="img"
                sx={{ width: '250px' }}
                image={`https://img.youtube.com/vi/${props.video.id}/mqdefault.jpg`}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {props.video.title}
                    </Typography>
                    <Typography
                        flex={1}
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                    >
                        {props.video.channelName}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        component="div"
                        sx={{ bottom: '0' }}
                    >
                        {`Watched on ${new Date(
                            props.timestamp,
                        ).toLocaleString()}`}
                    </Typography>
                </CardContent>
            </Box>
            <Box sx={{ color: 'blue' }}></Box>
        </Card>
    );
};
