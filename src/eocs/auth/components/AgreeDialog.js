import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useState} from "react";

export function AgreeDialog(props){

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
                <Button onClick={() => props.handleClose(false)}>action.agree_dialog.disagree</Button>
                <Button onClick={() => props.handleClose(true)} autoFocus>action.agree_dialog.agree</Button>
            </DialogActions>
        </Dialog>
    );
}
