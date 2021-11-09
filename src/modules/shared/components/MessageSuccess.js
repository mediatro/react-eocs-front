import {Alert} from "@mui/material";

export function MessageSuccess(props){
    return (
        <Alert severity="success">
            {props.children}
        </Alert>
    );
}
