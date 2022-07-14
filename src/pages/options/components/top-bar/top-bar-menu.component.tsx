import { MoreVert } from '@mui/icons-material';
import { IconButton, Menu } from '@mui/material';
import * as React from 'react';
import { filterHistory, hiddenVideos } from '../../../../util/chrome-storage';
import { ClearHistoryMenuItem } from './clear-menu-item.component';

/**
 * TopBar Menu (three dots)
 *
 * @returns TopBarMenu Component
 */
export const TopBarMenu: React.FunctionComponent = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                color="inherit"
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <ClearHistoryMenuItem
                    onClick={filterHistory.clear}
                    menuText="Clear filter history"
                    message="Do you want to clear the filter history?"
                    confirm="Clear"
                    cancel="Cancel"
                />
                <ClearHistoryMenuItem
                    onClick={hiddenVideos.clear}
                    menuText="Clear hidden videos"
                    message="Do you want to clear your hidden videos?"
                    confirm="Clear"
                    cancel="Cancel"
                />
            </Menu>
        </>
    );
};
