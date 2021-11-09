import {FormattedMessage, useIntl} from "react-intl";
import {
    Box, Button, Grid,
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
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentHistory} from "../../payments/components/PaymentHistory";
import {UserManagerContext, UserType} from "../../auth/services/UserManagerProvider";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import parse from 'html-react-parser';
import {OfferConsent} from "./OfferConsent";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {PaymentManagerContext} from "../../payments/services/PaymentProvider";
import {SPaper} from "../../../shared/components/SPaper";
import {Profile} from "../../auth/components/Profile";
import {useNewUserFlow} from "../services/NewUserFlow";
import {NewUserStepper} from "./NewUserStepper";
import {Compliance} from "./Compliance";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {TH1} from "../../../shared/components/TH1";
import {TSubtitle1} from "../../../shared/components/TSubtitle1";
import {TCardTitle} from "../../../shared/components/TCardTitle";
import {MessageWarning} from "../../../shared/components/MessageWarning";
import {ContainerMid} from "../../../shared/components/ContainerMid";


export function HomePage(){

    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const pmc = useContext(PaymentManagerContext);

    const flow = useNewUserFlow();




    return (

            !authc.manager.getUser() ? <>
                <ContainerSmall>
                    <TH1>
                        <FormattedMessage id={'home.text.welcome.0'}/>
                    </TH1>

                    <TSubtitle1>
                        <FormattedMessage id={'home.text.welcome.1'}/>
                    </TSubtitle1>

                    <Link to={'/register'}>
                        <FormattedMessage id={'page.register'}/>
                    </Link>
                </ContainerSmall>
            </> : <>

                {authc.manager.getUser().id && (
                    !flow.isEverythingComplete()
                        ? <NewUserStepper/>

                        :
                            <ContainerMid>

                                <Grid item xs md={6}>
                                    <SPaper>
                                        <Profile/>
                                    </SPaper>
                                </Grid>

                                <Grid item xs>

                                    {authc.manager.getUser().activePaymentDetail && <SPaper>
                                        <TCardTitle>
                                            <FormattedMessage id={'payment.field.payment_detail.active'}/>
                                        </TCardTitle>

                                        {!pmc.manager.isPaymentRequestAvailable() &&
                                            <MessageWarning>
                                                <FormattedMessage id={'home.text.wait_for_payment_details_verification'}/>
                                            </MessageWarning>
                                        }

                                        <Typography>
                                            <Typography>{authc.manager.getUser().activePaymentDetail["@id"]} - {authc.manager.getUser().activePaymentDetail.displayString} - {authc.manager.getUser().activePaymentDetail.status}</Typography>
                                        </Typography>
                                    </SPaper>}
                                </Grid>

                                {!umc.manager.isUserVerified()
                                    ?
                                        <Compliance/>
                                    :
                                        <>
                                            <Grid item xs md={6}>
                                                <OfferConsent/>
                                            </Grid>

                                            <Grid item xs md={12}>
                                                <PaymentHistory/>
                                            </Grid>
                                        </>
                                }


                                {/*{(!authc.manager.getUser().paymentDetails || authc.manager.getUser().paymentDetails.length < 1) &&
                            <PBox>
                                <Typography>
                                    <FormattedMessage id={'home.text.payment_details_required'}/>
                                    <Link to={'/payment-details'}><FormattedMessage id={'page.payment_details'}/></Link>
                                </Typography>
                            </PBox>
                            }*/}
                            </ContainerMid>
                )}
            </>

    );
}
