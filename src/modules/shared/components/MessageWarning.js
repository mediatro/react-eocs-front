import {Alert} from "@mui/material";

export function MessageWarning(props){
    return (
        <Alert severity="warning">
            {props.children}
        </Alert>
    );
}
