import {Box, Button, Paper, Typography} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {Form} from "react-final-form";
import {Select, TextField} from "mui-rff";
import {useContext, useState} from "react";
import {PaymentManagerContext} from "../services/PaymentProvider";
import camelize from "camelize";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {ActivePaymentRequests} from "./ActivePaymentRequests";
import {OnChange} from "react-final-form-listeners";

export function PaymentRequestPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const [amount, setAmount] = useState(0);
    const [site, setSite] = useState(null);

    const getActivePaymentDetail = () => authc.manager.getUser()['activePaymentDetail'];

    const onSubmit = (formValue) => {
        let nv = {...camelize(formValue), ...{
            amount: parseFloat(formValue.amount),
            detail: getActivePaymentDetail()['@id'],
            siteHistoryRecord: site['@id'],
        }};

        pmc.manager.getCreatePaymentRequestQuery(nv).subscribe((v) => {
            console.log(v);
        });
    };

    const getAvailableSiteRecords = () => {
        return authc.manager.getUser().availableSiteRecords || [];
    }

    return (
        <Box sx={{width: 400}}>

            {authc.manager.getUser().activePaymentRequests && authc.manager.getUser().activePaymentRequests.length > 0 && <ActivePaymentRequests/>}

            <Paper>
                <Box p={1} m={1}>
                    {pmc.manager.isPaymentRequestBlocked() ? <>
                        <Typography>
                            <FormattedMessage id={'payment.text.payment_request.blocked'}/><br/>
                            <FormattedMessage id={`payment.text.payment_request.blocked.${pmc.manager.isPaymentRequestBlocked()}`}/>
                        </Typography>
                    </> : <>
                        <Typography><FormattedMessage id={'payment.field.payment_detail.limit'}/> (USD):</Typography>
                        <Typography>{getActivePaymentDetail() ? getActivePaymentDetail().payLimit : '-'}</Typography>

                        <Form
                            onSubmit={onSubmit}
                            render={({ handleSubmit, values }) => (
                                <form onSubmit={handleSubmit}>

                                    <Select name="site"
                                            label={intl.formatMessage({id: "user.field.site"})}
                                            required={true}
                                            value={site}
                                            onChange={(e)=> {setSite(e.target.value)}}
                                            data={getAvailableSiteRecords().map(record => ({
                                                label: record.site.name,
                                                value: record
                                            }))}
                                    />

                                    <TextField name="amount" type={'number'}
                                               label={intl.formatMessage({id: "payment.field.amount"})}
                                               required={true}
                                               value={amount}
                                               inputProps={{ inputMode: 'numeric' }}
                                    />
                                    <OnChange name="amount">
                                        {(value, previous) => {
                                            setAmount(Math.min(value, getActivePaymentDetail().payLimit));
                                        }}
                                    </OnChange>

                                    <Box mt={2}>
                                        <Button type="submit"
                                                variant="contained"
                                                disabled={fic.loading}
                                        >
                                            <FormattedMessage id={'payment.action.payment_request.submit'}/>
                                        </Button>
                                    </Box>
                                </form>
                            )}
                        />
                    </>}
                </Box>
            </Paper>
        </Box>
    );
}
