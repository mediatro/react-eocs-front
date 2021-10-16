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

export function HomePage(props){

    const authc = useContext(AuthContext);

    return (
        <Box>
            {!authc.manager.getUser() ? <>
                <FormattedMessage id={'text.home.welcome.0'}/>
                <br/>
                <FormattedMessage id={'text.home.welcome.1'}/>
                <br/>
                <Link to={'/register'}>
                    <FormattedMessage id={'page.register'}/>
                </Link>
            </> : <>
                {authc.manager.isVerified() ? <>
                    <PaymentHistory/>
                </> : <>
                    <FormattedMessage id={'text.home.wait_for_verification'}/>
                </>}
            </>}
        </Box>
    );
}
