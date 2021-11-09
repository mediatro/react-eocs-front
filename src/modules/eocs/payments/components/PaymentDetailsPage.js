import {Box, Button, Grid, Paper, Typography} from "@mui/material";
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
import {PaymentDetailsList} from "./PaymentDetailsList";
import {SPaper} from "../../../shared/components/SPaper";
import {PaymentDetailsForm} from "./PaymentDetailsForm";
import {MessageWarning} from "../../../shared/components/MessageWarning";
import {ContainerMid} from "../../../shared/components/ContainerMid";

export function PaymentDetailsPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);



    return (
        <ContainerMid>
            <Grid item xs md={6}>
                {authc.manager.getUser().paymentDetails && <PaymentDetailsList/>}
            </Grid>

            <Grid item xs>
                <PaymentDetailsForm/>
            </Grid>
        </ContainerMid>
    );
}
