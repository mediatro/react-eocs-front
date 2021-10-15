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

export function PaymentDetailsPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const countries = useMemo(() => countryList().getData(), []);

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
                                label={"field.payment.method"}
                                required={true}
                                value={paymentType}
                                onChange={(e)=> {setPaymentType(e.target.value)}}
                                data={Object.keys(PaymentType).map(k => ({
                                    label: intl.formatMessage({id: `field.payment.method.${PaymentType[k]}`}),
                                    value: PaymentType[k]
                                }))}
                        />

                        <Select name="currency"
                                label={"field.payment.currency"}
                                required={true}
                                data={AvailableCurrencies[getCurrencyType()].map(v => ({
                                    label: v,
                                    value: v
                                }))}
                        />


                        {paymentType === PaymentType.WIRE_TRANSFER && <>
                            <TextField name="account_holder_name"
                                       label="field.payment.wire.account_holder_name"
                                       required={true}
                            />
                            <CountrySelect name="country"
                                           label="form.country"
                                           required={true}
                            />

                            <TextField name="beneficiary_bank_name"
                                       label="field.payment.wire.beneficiary_bank_name"
                                       required={true}
                            />
                            <TextField name="beneficiary_bank_address"
                                       label="field.payment.wire.beneficiary_bank_address"
                                       required={true}
                            />
                            <TextField name="beneficiary_bank_account_iban"
                                       label="field.payment.wire.beneficiary_bank_account_iban"
                                       required={true}
                            />
                            <TextField name="beneficiary_bank_swift"
                                       label="field.payment.wire.beneficiary_bank_swift"
                                       required={true}
                            />

                        </>}

                        {paymentType === PaymentType.PSP && <>
                            <TextField name="account_holder_name"
                                       label="field.payment.psp.account_holder_name"
                                       required={true}
                            />
                            <TextField name="wallet_number_email"
                                       label="field.payment.psp.wallet_number_email"
                                       required={true}
                            />
                        </>}

                        {paymentType === PaymentType.OCT && <>
                            <TextField name="card_holder_name"
                                       label="field.payment.oct.card_holder_name"
                                       required={true}
                            />
                            <TextField name="card_number"
                                       label="field.payment.oct.card_number"
                                       required={true}
                            />
                            <TextField name="card_expiry"
                                       label="field.payment.oct.card_expiry"
                                       required={true}
                            />
                        </>}

                        {paymentType === PaymentType.CRYPTO && <>
                            <TextField name="platform"
                                       label="field.payment.crypto.platform"
                                       required={true}
                            />
                            <TextField name="wallet_number"
                                       label="field.payment.crypto.wallet_number"
                                       required={true}
                            />
                        </>}

                        <Button type="submit" variant="contained">action.payment.create_details</Button>
                    </form>
                )}
            />
        </Box>
    );
}
