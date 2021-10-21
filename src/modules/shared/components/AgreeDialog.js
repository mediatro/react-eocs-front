import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useState} from "react";
import {useIntl} from "react-intl";


export const useAgreeDialog = () => {

    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState({});

    const handleAgreeDialogOpen = (v) => {
        setOpen(v);
    };

    const handleAgreeDialogClose = (t) => {
        return (v) => {
            setOpen(false);
            let nc = checked;
            nc[t] = v;
            setChecked(nc);
        };
    };

    return {
        open: open,
        setOpen: setOpen,
        checked: checked,
        setChecked: setChecked,
        handleAgreeDialogOpen: handleAgreeDialogOpen,
        handleAgreeDialogClose: handleAgreeDialogClose,
    }

}

export function AgreeDialog(props){

    const intl = useIntl();

    return (
        <Dialog open={props.open}
                onClose={props.handleClose}
        >
            <DialogTitle>{props.title}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {props.body}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => props.handleClose(false)}>{intl.formatMessage({id: 'shared.action.agree_dialog.disagree'})}</Button>
                <Button onClick={() => props.handleClose(true)} autoFocus>{intl.formatMessage({id: 'shared.action.agree_dialog.agree'})}</Button>
            </DialogActions>
        </Dialog>
    );
}
