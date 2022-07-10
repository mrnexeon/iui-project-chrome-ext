import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import * as React from 'react';
import { TopBarMenu } from './top-bar-menu.component';

interface IProps {
    pageTitle?: string;
}

/**
 * Top Bar for Options Page incl. Search Bar
 * (copied from mui.com)
 *
 * @param props
 * @returns TopBar Component
 */
export const TopBar: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        {`YouLearn ${
                            _.isUndefined(props.pageTitle) ? '' : ' |'
                        }`}
                    </Typography>
                    <TopBarMenu />
                </Toolbar>
            </AppBar>
        </Box>
    );
};
