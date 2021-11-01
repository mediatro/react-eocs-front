import {Box, Button, Paper, Typography} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {Field, Form} from "react-final-form";
import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import MuiPhoneNumber from "material-ui-phone-number";
import DateFnsUtils from "@date-io/date-fns";
import {
    AvailableCurrencies,
    CurrencyType,
    PaymentManagerContext,
    PaymentType,
    Priority
} from "../services/PaymentProvider";
import {useContext, useEffect, useMemo, useState} from "react";
import countryList from "react-select-country-list";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import camelize from "camelize";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {ActivePaymentDetail} from "./ActivePaymentDetail";
import {PBox} from "../../../shared/components/PBox";
import {PaymentDetailsForm} from "./PaymentDetailsForm";

export function PaymentDetailsPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);



    return (
        <Box style={{width: 600}}>

            {authc.manager.getUser().paymentDetails && <ActivePaymentDetail/>}

            {pmc.manager.isPaymentDetailsBlocked() && <PBox>
                <Typography>
                    <FormattedMessage id={'payment.text.payment_details.blocked'}/>
                </Typography>
                <Typography>
                    <FormattedMessage id={`payment.text.payment_details.blocked.${pmc.manager.isPaymentDetailsBlocked()}`}/>
                </Typography>
            </PBox>}

            {pmc.manager.getAvailablePriorities().length === 1 && pmc.manager.getAvailablePriorities()[0] == Priority.SECONDARY && <PBox>
                <Typography>
                    <FormattedMessage id={'payment.text.payment_details.secondary_only'}/>
                </Typography>
            </PBox>}

            <PaymentDetailsForm/>
        </Box>
    );
}
