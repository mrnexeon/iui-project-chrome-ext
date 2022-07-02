import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import * as React from 'react';

/**
 * Top Bar for Popup
 * (copied from mui.com)
 *
 * @param props
 * @returns TopBar Component
 */
export const TopBar: React.FunctionComponent = (): JSX.Element => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    YouLearn
                </Typography>
                <Button
                    onClick={() => {
                        chrome.runtime.openOptionsPage();
                    }}
                >
                    Options
                </Button>
            </Toolbar>
        </AppBar>
    );
};
