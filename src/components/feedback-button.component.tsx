import { Flag } from '@mui/icons-material';
import {
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    ThemeProvider,
    Tooltip,
    Typography,
} from '@mui/material';
import * as React from 'react';
import { reportFeedback } from '../api/client';
import { usePreferredTheme } from '../hooks/theme.hook';
import { recommendations } from '../service/youtube-dom/recommendations.service';
import { hiddenVideos } from '../util/chrome-storage/hidden-videos.util';

interface IProps {
    id: string;
}

/**
 * Button to provide feedback
 *
 * @param props
 * @returns FeedbackButton Component
 */
export const FeedbackButton: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    const theme = usePreferredTheme();

    const [isLoading, setIsLoading] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onMarkDistractingClick = React.useCallback(async () => {
        setIsLoading(true);
        try {
            await reportFeedback(props.id, true);
        } catch (e) {
            console.log(e);
        }

        hiddenVideos.push(props.id);
        setIsLoading(false);
        handleClose();

        recommendations.hide([props.id]);
    }, [props.id]);

    return (
        <ThemeProvider theme={theme}>
            <Tooltip
                placement="left"
                title={
                    <Typography variant="body1">Mark as distracting</Typography>
                }
                sx={{ fontSize: '8pt' }}
            >
                <IconButton
                    sx={{ padding: '5px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        handleClick(e);
                    }}
                >
                    <Flag />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ padding: 0 }}
            >
                <MenuItem onClick={onMarkDistractingClick}>
                    {isLoading && (
                        <CircularProgress
                            size="15px"
                            sx={{ marginRight: '5px' }}
                            color="inherit"
                        />
                    )}
                    <Typography
                        variant="h6"
                        color={isLoading ? 'text.secondary' : undefined}
                    >
                        Mark video as distracting
                    </Typography>
                </MenuItem>
            </Menu>
        </ThemeProvider>
    );
};
