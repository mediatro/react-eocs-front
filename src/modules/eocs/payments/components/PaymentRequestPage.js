import {Box, Button, Paper, Typography} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Link} from "react-router-dom";
import {Form} from "react-final-form";
import {TextField} from "mui-rff";
import {useContext} from "react";
import {PaymentManagerContext} from "../services/PaymentProvider";
import camelize from "camelize";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {ActivePaymentRequests} from "./ActivePaymentRequests";

export function PaymentRequestPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const getActivePaymentDetail = () => authc.manager.getUser()['activePaymentDetail'];

    const onSubmit = (formValue) => {
        let nv = {...camelize(formValue), ...{
            amount: parseFloat(formValue.amount),
            detail: getActivePaymentDetail()['@id'],
        }};

        pmc.manager.getCreatePaymentRequestQuery(nv).subscribe((v) => {
            console.log(v);
        });
    };

    return (
        <Box sx={{width: 400}}>
            {authc.manager.getUser().activePaymentRequests &&  <ActivePaymentRequests/>}

            <Paper>
                <Box p={1} m={1}>
                    <Typography><FormattedMessage id={'payment.field.payment_detail.limit'}/> (USD):</Typography>
                    <Typography>{getActivePaymentDetail() ? getActivePaymentDetail().payLimit : '-'}</Typography>

                    <Form
                        onSubmit={onSubmit}
                        render={({ handleSubmit, values }) => (
                            <form onSubmit={handleSubmit}>
                                <TextField name="amount" type={'number'}
                                           label={intl.formatMessage({id: "payment.field.amount"})}
                                           required={true}
                                           inputProps={{ inputMode: 'numeric' }}
                                />

                                <Button type="submit"
                                        variant="contained"
                                        disabled={fic.loading}
                                >
                                    <FormattedMessage id={'payment.action.payment_request.submit'}/>
                                </Button>
                            </form>
                        )}
                    />
                </Box>
            </Paper>
        </Box>
    );
}
