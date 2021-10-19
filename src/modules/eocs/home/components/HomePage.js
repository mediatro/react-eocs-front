import {FormattedMessage} from "react-intl";
import {
    Box,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentHistory} from "../../payments/components/PaymentHistory";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";

export function HomePage(){

    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);

    return (
        <Box>
            {!authc.manager.getUser() ? <>
                <FormattedMessage id={'home.text.welcome.0'}/><br/>
                <FormattedMessage id={'home.text.welcome.1'}/><br/>
                <Link to={'/register'}><FormattedMessage id={'page.register'}/></Link>
            </> : <>
                {umc.manager.isUserVerified() ? <>
                    <PaymentHistory/>
                </> : <>
                    <FormattedMessage id={'home.text.wait_for_verification'}/>
                </>}
            </>}
        </Box>
    );
}
