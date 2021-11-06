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
    TableRow, Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentHistory} from "../../payments/components/PaymentHistory";
import {UserManagerContext, UserType} from "../../auth/services/UserManagerProvider";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import parse from 'html-react-parser';
import {OfferConsent} from "./OfferConsent";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {PaymentManagerContext} from "../../payments/services/PaymentProvider";
import {PBox} from "../../../shared/components/PBox";
import {ProfileEdit} from "./ProfileEdit";
import {useNewUserFlow} from "../services/NewUserFlow";
import {NewUserStepper} from "./NewUserStepper";
import {Compliance} from "./Compliance";


export function HomePage(){

    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const pmc = useContext(PaymentManagerContext);

    const flow = useNewUserFlow();

    return (
        <Box>
            {!authc.manager.getUser() ? <>
                <PBox>
                    <Typography>
                        <FormattedMessage id={'home.text.welcome.0'}/><br/>
                        <FormattedMessage id={'home.text.welcome.1'}/><br/>
                        <Link to={'/register'}><FormattedMessage id={'page.register'}/></Link>
                    </Typography>
                </PBox>
            </> : <>

                {authc.manager.getUser().id && (
                    !flow.isEverythingComplete()
                        ? <NewUserStepper/>

                        : <>

                            <PBox>
                                <Typography>
                                    <FormattedMessage id={'auth.field.user.erp_id'}/>: {authc.manager.getUser().erpId}
                                </Typography>

                                {authc.manager.getUser().userType === UserType.PRIVATE_INDIVIDUAL && <Typography>
                                    <FormattedMessage id={'auth.field.user.full_name'}/>: {authc.manager.getUser().firstName} {authc.manager.getUser().lastName}
                                </Typography>}
                            </PBox>

                            <PBox>
                                <ProfileEdit/>
                            </PBox>


                            {authc.manager.getUser().activePaymentDetail && <PBox>
                                <Typography variant={'h4'}>
                                    <FormattedMessage id={'payment.field.payment_detail.active'}/>
                                </Typography>

                                <Typography>
                                    <Typography>{authc.manager.getUser().activePaymentDetail["@id"]} - {authc.manager.getUser().activePaymentDetail.displayString} - {authc.manager.getUser().activePaymentDetail.status}</Typography>
                                </Typography>
                            </PBox>}


                            {/*{(!authc.manager.getUser().paymentDetails || authc.manager.getUser().paymentDetails.length < 1) &&
                            <PBox>
                                <Typography>
                                    <FormattedMessage id={'home.text.payment_details_required'}/>
                                    <Link to={'/payment-details'}><FormattedMessage id={'page.payment_details'}/></Link>
                                </Typography>
                            </PBox>
                            }*/}

                            {!umc.manager.isUserVerified()
                                ?
                                <Compliance/>

                                : <>
                                    {!pmc.manager.isPaymentRequestAvailable() &&
                                        <PBox>
                                            <Typography>
                                                <FormattedMessage id={'home.text.wait_for_payment_details_verification'}/>
                                            </Typography>
                                        </PBox>
                                    }

                                    <OfferConsent/>
                                    <PaymentHistory/>
                                </>}
                        </>
                )}
            </>}
        </Box>
    );
}
