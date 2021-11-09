import {Box, Paper} from "@mui/material";

export function SPaper(props){

    return (
        <Paper sx={{p: 2}}>
            {props.children}
        </Paper>
    );

}
