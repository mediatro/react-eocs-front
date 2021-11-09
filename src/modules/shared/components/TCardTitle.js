import {Typography} from "@mui/material";

export function TCardTitle(props){
    return (
        <Typography component="h2" variant="h6" gutterBottom>
            {props.children}
        </Typography>
    );
}
