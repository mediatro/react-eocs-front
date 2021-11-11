import {Box, Button, Grid, Link, Step, StepLabel, Stepper} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentManagerContext} from "../../payments/services/PaymentProvider";
import {RegisterPage} from "../../auth/components/RegisterPage";
import {PaymentDetailsPage} from "../../payments/components/PaymentDetailsPage";
import {OfferConsent} from "./OfferConsent";
import {Steps, useNewUserFlow} from "../services/NewUserFlow";
import {Compliance} from "./Compliance";
import {FormattedMessage, useIntl} from "react-intl";
import {PaymentDetailsForm} from "../../payments/components/PaymentDetailsForm";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {RegisterForm} from "../../auth/components/RegisterForm";
import {MessageSuccess} from "../../../shared/components/MessageSuccess";
import {useHistory} from "react-router-dom";


export function NewUserStepper(props){

    const intl = useIntl();
    const history = useHistory();
    const flow = useNewUserFlow();

    const steps = Object.keys(Steps).map(k => Steps[k]);

    const finish = () => {
        flow.active = false;
        history.push('/');
    }

    return (
        <Box>
            <Stepper activeStep={flow.getActiveStepNumber()}>
                {steps.map((label, index) => {
                    return (
                        <Step key={label}>
                            <StepLabel>
                                <FormattedMessage id={label}/>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <ContainerSmall>
                {flow.getActiveStepString() === Steps.REGISTER && <RegisterForm user={props.user}/>}
                {flow.getActiveStepString() === Steps.PAYMENT_DETAILS &&
                    <Grid container justifyContent={'center'}>
                        <Grid item xs sm={9}>
                            <PaymentDetailsForm/>
                        </Grid>
                    </Grid>
                }
                {flow.getActiveStepString() === Steps.COMPLIANCE && <Compliance/>}
                {flow.getActiveStepString() === Steps.OFFERS && !flow.isOffersComplete() && <OfferConsent/>}
                {flow.isEverythingComplete() && flow.active &&
                    <>
                        <MessageSuccess>
                            <FormattedMessage id={'home.text.flow.complete'}/>
                        </MessageSuccess>

                        <Button variant={'contained'}
                                onClick={finish}
                                sx={{mt:2}}
                        >
                            <FormattedMessage id='home.action.flow.finish'/>
                        </Button>
                    </>
                }
            </ContainerSmall>
        </Box>
    );
}
