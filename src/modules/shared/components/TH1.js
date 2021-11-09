import {Typography} from "@mui/material";

export function TH1(props){
    return (
        <Typography component="h1" variant="h5">
            {props.children}
        </Typography>
    );
}
