import {Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";

export function TKeyValueInline(props){
    return (
        <Typography>
            <Typography variant={'subtitle1'} style={{display: 'inline'}}>
                {props.tkey}:{' '}
            </Typography>

            <Typography variant={'h6'} style={{display: 'inline'}}>
                {props.value}
            </Typography>
        </Typography>
    );
}
