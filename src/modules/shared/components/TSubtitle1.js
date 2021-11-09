import {Typography} from "@mui/material";

export function TSubtitle1(props){
    return (
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            {props.children}
        </Typography>
    );
}
