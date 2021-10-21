import {Box, Button} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {Field, Form} from "react-final-form";
import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import MuiPhoneNumber from "material-ui-phone-number";
import DateFnsUtils from "@date-io/date-fns";
import {AvailableCurrencies, CurrencyType, PaymentManagerContext, PaymentType} from "../services/PaymentProvier";
import {useContext, useMemo, useState} from "react";
import countryList from "react-select-country-list";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import camelize from "camelize";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";

export function PaymentDetailsPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const [paymentType, setPaymentType] = useState(PaymentType.WIRE_TRANSFER);

    const onSubmit = (formValue) => {
        let nv = {...camelize(formValue), ...{
            method: paymentType,
            user: authc.manager.getUser()['@id'],
        }};

        pmc.manager.getCreatePaymentDetailsQuery(nv).subscribe((v) => {
            console.log(v);
        });
    };

    const getCurrencyType = () => {
        return paymentType === PaymentType.CRYPTO ? CurrencyType.CRYPTO : CurrencyType.REAL;
    }


    return (
        <Box style={{width: 300}}>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>

                        <Select name="method"
                                label={intl.formatMessage({id: "payment.field.method"})}
                                required={true}
                                value={paymentType}
                                onChange={(e)=> {setPaymentType(e.target.value)}}
                                data={Object.keys(PaymentType).map(k => ({
                                    label: intl.formatMessage({id: `payment.field.method.${PaymentType[k]}`}),
                                    value: PaymentType[k]
                                }))}
                        />

                        <Select name="currency"
                                label={intl.formatMessage({id: "payment.field.currency"})}
                                required={true}
                                data={AvailableCurrencies[getCurrencyType()].map(v => ({
                                    label: v,
                                    value: v
                                }))}
                        />

                        {paymentType === PaymentType.WIRE_TRANSFER && <>
                            <TextField name="account_holder_name"
                                       label={intl.formatMessage({id: "payment.field.wire.account_holder_name"})}
                                       required={true}
                            />
                            <CountrySelect name="country"
                                           label="form.country"
                                           required={true}
                            />

                            <TextField name="beneficiary_bank_name"
                                       label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_name"})}
                                       required={true}
                            />
                            <TextField name="beneficiary_bank_address"
                                       label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_address"})}
                                       required={true}
                            />
                            <TextField name="beneficiary_bank_account_iban"
                                       label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_account_iban"})}
                                       required={true}
                            />
                            <TextField name="beneficiary_bank_swift"
                                       label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_swift"})}
                                       required={true}
                            />

                        </>}

                        {paymentType === PaymentType.PSP && <>
                            <TextField name="platform"
                                       label={intl.formatMessage({id: "payment.field.psp.platform"})}
                                       required={true}
                            />
                            <TextField name="account_holder_name"
                                       label={intl.formatMessage({id: "payment.field.psp.account_holder_name"})}
                                       required={true}
                            />
                            <TextField name="wallet_number_email"
                                       label={intl.formatMessage({id: "payment.field.psp.wallet_number_email"})}
                                       required={true}
                            />
                        </>}

                        {paymentType === PaymentType.OCT && <>
                            <TextField name="card_holder_name"
                                       label={intl.formatMessage({id: "payment.field.oct.card_holder_name"})}
                                       required={true}
                            />
                            <TextField name="card_number"
                                       label={intl.formatMessage({id: "payment.field.oct.card_number"})}
                                       required={true}
                            />
                            <TextField name="card_expiry"
                                       label={intl.formatMessage({id: "payment.field.oct.card_expiry"})}
                                       required={true}
                            />
                        </>}

                        {paymentType === PaymentType.CRYPTO && <>
                            <TextField name="platform"
                                       label={intl.formatMessage({id: "payment.field.crypto.platform"})}
                                       required={true}
                            />
                            <TextField name="wallet_number"
                                       label={intl.formatMessage({id: "payment.field.crypto.wallet_number"})}
                                       required={true}
                            />
                        </>}

                        <Button type="submit"
                                variant="contained"
                                disabled={fic.loading}
                        >
                            <FormattedMessage id={'payment.action.details_create'}/>
                        </Button>
                    </form>
                )}
            />
        </Box>
    );
}
