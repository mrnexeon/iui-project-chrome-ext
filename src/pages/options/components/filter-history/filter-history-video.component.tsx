import { ArrowForwardIos, PlayArrow } from '@mui/icons-material';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import * as React from 'react';
import { IFilterHistoryEntry } from '../../../../model/chrome-storage/stats.model';

interface IProps {
    entry: IFilterHistoryEntry;
    onClick?: () => void;
}

/**
 * Single History Video, that is video with thumbnail, title etc.
 * NOTE: This is the video component WITHOUT feedback button
 *
 * @param props Props
 * @returns FilterHistoryEntry Component
 */
export const FilterHistoryVideo: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    const [thumbnailHover, setThumbnailHover] = React.useState(false);
    const [cardHover, setCardHover] = React.useState(false);

    return (
        <Card
            sx={{ display: 'flex', position: 'relative', cursor: 'pointer' }}
            elevation={cardHover ? 5 : 1}
        >
            {thumbnailHover && (
                <Box
                    onClick={() => {
                        window.open(
                            `https://youtube.com/watch?v=${props.entry.sourceVideo.id}`,
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
                image={`https://img.youtube.com/vi/${props.entry.sourceVideo.id}/mqdefault.jpg`}
                alt="Live from space album cover"
            />
            <Box
                sx={{ display: 'flex', flexDirection: 'column' }}
                flex="1"
                onMouseOver={() => setCardHover(true)}
                onMouseLeave={() => setCardHover(false)}
                onClick={props.onClick}
            >
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        component="div"
                    >
                        {`${new Date(props.entry.utcDate).toLocaleString()}, ${
                            props.entry.filteredVideos.length
                        } video were filtered`}
                    </Typography>
                    <Typography component="div" variant="h6">
                        {props.entry.sourceVideo.title}
                    </Typography>
                    <Typography
                        flex={1}
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                    >
                        {props.entry.sourceVideo.channelName}
                    </Typography>
                </CardContent>
            </Box>
            <Box sx={{ height: '100%', width: '50px' }} onClick={props.onClick}>
                <ArrowForwardIos
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translate(0, -50%)',
                    }}
                />
            </Box>
        </Card>
    );
};
