import {Typography, useTheme} from "@mui/material";

export function TStatus(props){

    const theme = useTheme();

    const getColor = (status) => {
        if(['blocked', 'rejected', 'tochange'].includes(status)){
            return theme.palette.error.main;
        }
        if(['verified'].includes(status)){
            return theme.palette.success.main;
        }
        return theme.palette.warning.main;
    }

    return (
        <Typography variant={'h6'} color={getColor(props.status)}>
            {props.children}
        </Typography>
    );
}
