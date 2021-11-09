import {Box, Grid} from "@mui/material";

export function ContainerMid(props){

    return (
        <Grid container spacing={2}>
            {props.children}
        </Grid>
    );

}
