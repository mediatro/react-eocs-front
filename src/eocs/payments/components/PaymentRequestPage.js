import {Box, Button, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {Link} from "react-router-dom";
import {Form} from "react-final-form";
import {TextField} from "mui-rff";
import {useContext} from "react";
import {PaymentManagerContext} from "../services/PaymentProvier";
import camelize from "camelize";
import {AuthContext} from "../../../shared/services/AuthProvider";

export function PaymentRequestPage(){

    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);

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
        <Box sx={{width: 300}}>
            <Typography>field.payment_detail.limit :</Typography>
            <Typography>{getActivePaymentDetail().payLimit}</Typography>

            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField name="amount" type={'number'}
                                   label="field.payment_request.amount"
                                   required={true}
                                   inputProps={{ inputMode: 'numeric' }}
                        />

                        <Button type="submit" variant="contained">action.payment_request.submit</Button>
                    </form>
                )}
            />
        </Box>
    );
}
