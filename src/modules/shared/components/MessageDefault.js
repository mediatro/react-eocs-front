import {Alert} from "@mui/material";

export function MessageDefault(props){
    return (
        <Alert severity={'info'}>
            {props.children}
        </Alert>
    );
}
