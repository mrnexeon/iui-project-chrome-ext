import { ExpandLess, ExpandMore, PlayArrow } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import * as React from 'react';
import { IFilterHistoryEntry } from '../../../../model/chrome-storage/stats.model';

interface IProps {
    entries: [IFilterHistoryEntry, ...IFilterHistoryEntry[]];
    onClick: (sessionId: string) => void;
}

/**
 * Single History Video, that is video with thumbnail, title etc.
 * If entries > 1 the other videos are hidden in a collapse
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
    const [collapseHover, setCollapseHover] = React.useState(false);

    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const toggleCollapsed = React.useCallback(
        () => setIsCollapsed(!isCollapsed),
        [isCollapsed],
    );

    const [collapseItemThreshold, setCollapseItemThreshold] = React.useState(5);

    return (
        <Card
            sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            elevation={cardHover ? 5 : 1}
        >
            <Box sx={{ display: 'flex', position: 'relative' }}>
                {thumbnailHover && (
                    <Box
                        onClick={() => {
                            window.open(
                                `https://youtube.com/watch?v=${props.entries[0].sourceVideo.id}`,
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
                    image={`https://img.youtube.com/vi/${props.entries[0].sourceVideo.id}/mqdefault.jpg`}
                    alt="Live from space album cover"
                />
                <Box
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    flex="1"
                    onMouseOver={() => setCardHover(true)}
                    onMouseLeave={() => setCardHover(false)}
                    onClick={() => props.onClick(props.entries[0].sessionId)}
                >
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="div"
                        >
                            {`${new Date(
                                props.entries[0].utcDate,
                            ).toLocaleString()}, ${
                                props.entries[0].filteredVideos.length
                            } video were filtered`}
                        </Typography>
                        <Typography component="div" variant="h6">
                            {props.entries[0].sourceVideo.title}
                        </Typography>
                        <Typography
                            flex={1}
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                        >
                            {props.entries[0].sourceVideo.channelName}
                        </Typography>
                    </CardContent>
                </Box>
            </Box>
            {props.entries.length > 1 && (
                <>
                    <Card
                        sx={{
                            display: 'flex',
                            position: 'relative',
                            padding: '10px',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onMouseOver={() => setCollapseHover(true)}
                        onMouseLeave={() => setCollapseHover(false)}
                        elevation={collapseHover ? 5 : 1}
                        onClick={toggleCollapsed}
                    >
                        <Typography
                            component="div"
                            variant="body1"
                            color="text.secondary"
                        >
                            {`There ${
                                props.entries.length - 1 > 1 ? 'are' : 'is'
                            } ${
                                props.entries.length - 1
                            } more consecutive session${
                                props.entries.length - 1 > 1 ? 's' : ''
                            }`}
                        </Typography>
                        {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                    </Card>
                    {!isCollapsed && (
                        <Card
                            elevation={1}
                            sx={{
                                position: 'relative',
                            }}
                        >
                            <List sx={{ width: '100%' }}>
                                {props.entries
                                    .slice(1, collapseItemThreshold)
                                    .map((entry, index) => (
                                        <ListItem
                                            disablePadding
                                            key={`filter-history-m-entry-${index}`}
                                            onClick={() =>
                                                props.onClick(entry.sessionId)
                                            }
                                        >
                                            <ListItemButton>
                                                <ListItemText
                                                    sx={{
                                                        fontSize: '11pt',
                                                    }}
                                                    primary={`On ${new Date(
                                                        entry.utcDate,
                                                    ).toLocaleString()}, ${
                                                        entry.filteredVideos
                                                            .length
                                                    } videos were filtered`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                {collapseItemThreshold <
                                    props.entries.length - 1 && (
                                    <ListItem
                                        disablePadding
                                        key={`filter-history-m-entry-more}`}
                                        onClick={() =>
                                            setCollapseItemThreshold(
                                                collapseItemThreshold + 5,
                                            )
                                        }
                                    >
                                        <ListItemButton>
                                            <ListItemText
                                                sx={{
                                                    fontSize: '11pt',
                                                }}
                                                primary="Show more..."
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    )}
                </>
            )}
        </Card>
    );
};
