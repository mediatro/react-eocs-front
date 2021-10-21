import {FormattedMessage, useIntl} from "react-intl";
import {
    Box, Button,
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
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentHistory} from "../../payments/components/PaymentHistory";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import parse from 'html-react-parser';
import {OfferConsent} from "./OfferConsent";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";


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
                {authc.manager.getUser().id && <>
                    {(!authc.manager.getUser().paymentDetails || authc.manager.getUser().paymentDetails.length < 1) &&
                        <Box>
                            <FormattedMessage id={'home.text.payment_details_required'}/>
                            <Link to={'/payment-details'}><FormattedMessage id={'page.payment_details'}/></Link>
                        </Box>
                    }

                    {!umc.manager.isUserVerified() ? <>
                        <FormattedMessage id={'home.text.wait_for_verification'}/>

                    </> : <>
                        {!umc.manager.isPaymentRequestAvailable() && <FormattedMessage id={'home.text.wait_for_payment_details_verification'}/>}
                        <OfferConsent/>
                        {umc.manager.isActiveOfferConfirmed() &&<PaymentHistory/>}
                    </>}
                </>}
            </>}
        </Box>
    );
}
