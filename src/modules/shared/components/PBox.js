import {Box, Paper} from "@mui/material";

export function PBox(props){

    return (
        <Paper>
            <Box p={1} m={1}>
                {props.children}
            </Box>
        </Paper>
    );

}
