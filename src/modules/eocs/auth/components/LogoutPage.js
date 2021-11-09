import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {Box, Button, Typography} from "@mui/material";

export function LogoutPage(props){

    const authc = useContext(AuthContext);

    authc.manager.logout();

    return (
        <Typography>
            Logging out...
        </Typography>
    );
}
