import { Clear } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import * as React from 'react';

interface IProps {
    onClick: () => void;
    menuText: string;
    message: string;
    confirm: string;
    cancel: string;
}

/**
 * Button that opens a dialog and then executes onClick
 *
 * @param props
 * @returns ClearHistoryMenuItem Component
 */
export const ClearHistoryMenuItem: React.FunctionComponent<IProps> = (
    props: IProps,
): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <MenuItem onClick={handleClickOpen}>
                <ListItemIcon>
                    <Clear />
                </ListItemIcon>
                <ListItemText>{props.menuText}</ListItemText>
            </MenuItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="clear-history-dialog-title"
                aria-describedby="clear-history-dialog-description"
            >
                <DialogTitle id="clear-history-dialog-title">
                    {props.message}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        {props.cancel}
                    </Button>
                    <Button
                        onClick={() => {
                            props.onClick();
                            handleClose();
                        }}
                    >
                        {props.confirm}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
