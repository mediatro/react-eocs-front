import {Box, Step, StepLabel, Stepper} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentManagerContext} from "../../payments/services/PaymentProvider";
import {RegisterPage} from "../../auth/components/RegisterPage";
import {PaymentDetailsPage} from "../../payments/components/PaymentDetailsPage";
import {OfferConsent} from "./OfferConsent";
import {Steps, useNewUserFlow} from "../services/NewUserFlow";
import {Compliance} from "./Compliance";
import {useIntl} from "react-intl";
import {PaymentDetailsForm} from "../../payments/components/PaymentDetailsForm";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";


export function NewUserStepper(){

    const intl = useIntl();
    const flow = useNewUserFlow();

    const steps = Object.keys(Steps).map(k => Steps[k]);

    return (
        <Box>
            <Stepper activeStep={flow.getActiveStepNumber()}>
                {steps.map((label, index) => {
                    return (
                        <Step key={label}>
                            <StepLabel>{intl.formatMessage( {id: label})}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <ContainerSmall>
                {flow.getActiveStepString() === Steps.REGISTER && <RegisterPage/>}
                {flow.getActiveStepString() === Steps.PAYMENT_DETAILS && <PaymentDetailsForm/>}
                {flow.getActiveStepString() === Steps.COMPLIANCE && <Compliance/>}
                {flow.getActiveStepString() === Steps.OFFERS && <OfferConsent/>}
            </ContainerSmall>
        </Box>
    );
}
