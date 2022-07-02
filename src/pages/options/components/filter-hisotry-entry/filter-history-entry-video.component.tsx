import { PlayArrow } from '@mui/icons-material';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import * as React from 'react';
import { IFilterHistoryEntryVideo } from '../../../../model/chrome-storage/stats.model';
import { AsyncButton } from '../async-button/async-button.component';

interface IProps {
    video: IFilterHistoryEntryVideo;
    onMarkDistractingClick: () => Promise<void>;
}

/**
 * Single History Entry Video, that is video with thumbnail, title etc.
 * NOTE: This is the video component with feedback button
 *
 * @param props Props
 * @returns FilterHistoryEntry Component
 */
export const FilterHistoryEntryVideo: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    const [thumbnailHover, setThumbnailHover] = React.useState(false);

    return (
        <Card sx={{ display: 'flex', position: 'relative' }}>
            {thumbnailHover && (
                <Box
                    onClick={() => {
                        window.open(
                            `https://youtube.com/watch?v=${props.video.id}`,
                            '_blank',
                        );
                    }}
                    onMouseLeave={() => setThumbnailHover(false)}
                    sx={{
                        position: 'absolute',
                        width: '250px',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        cursor: 'pointer',
                    }}
                >
                    <PlayArrow
                        fontSize="large"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </Box>
            )}
            <CardMedia
                onMouseOver={() => setThumbnailHover(true)}
                component="img"
                sx={{ width: '250px', cursor: 'pointer' }}
                image={`https://img.youtube.com/vi/${props.video.id}/mqdefault.jpg`}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }} flex="1">
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
                </CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        pl: 1,
                        pb: 1,
                        padding: '10px',
                    }}
                >
                    <Box flex={1}></Box>
                    <AsyncButton
                        label="Mark as non-distracting"
                        successLabel="Thanks for your feedback"
                        onClick={props.onMarkDistractingClick}
                    />
                    {/* <Button onClick={props.onMarkDistractingClick}>
                        Mark as non-distracting
                    </Button> */}
                </Box>
            </Box>
        </Card>
    );
};
