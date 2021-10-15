import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {Box, Button} from "@mui/material";

export function LogoutPage(props){

    const authc = useContext(AuthContext);

    authc.manager.logout();

    return (
        <Box sx={{width: 300}}>
            Logging out...
        </Box>
    );
}
