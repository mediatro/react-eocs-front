import {Grid, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {TStatus} from "./TStatus";

export function TKeyValueGrid(props){

    return (
        <Grid container alignItems={"center"}>
            <Grid item xs>
                <Typography variant={'subtitle1'}>
                    {props.tkey}
                </Typography>
            </Grid>

            <Grid item xs>
                <Typography variant={'h6'}>
                    {props.value}
                </Typography>
            </Grid>
        </Grid>
    );
}
