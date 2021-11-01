import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentManagerContext} from "../services/PaymentProvider";
import {FormattedMessage, useIntl} from "react-intl";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import camelize from "camelize";
import {PBox} from "../../../shared/components/PBox";

export function PaymentHistory(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);

    const [paymentHistory, setPaymentHistory] = useState(null);

    useEffect(() => {
        pmc.manager.getPaymentsQuery(authc.manager.getUser().erpId).subscribe((v) => {
            if (v.data) {
                setPaymentHistory(v.data['hydra:member']);
            }
        });
    }, []);


    const handleRequestInvoice = (payment) => {
        let nv = {
            payment: payment['@id']
        };

        pmc.manager.getCreateInvoiceRequestQuery(nv).subscribe((v) => {
            console.log(v);
        });
    }

    return (
        paymentHistory !== null &&
            paymentHistory.length > 0
                ? <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell><FormattedMessage id={'payment.field.date'}/></TableCell>
                                <TableCell align="right"><FormattedMessage id={'payment.field.amount'}/></TableCell>
                                <TableCell align="right"><FormattedMessage id={'payment.field.currency'}/></TableCell>
                                <TableCell align="right"><FormattedMessage id={'payment.field.method'}/></TableCell>
                                <TableCell align="right"><FormattedMessage id={'payment.field.detail'}/></TableCell>
                                <TableCell align="right"><FormattedMessage id={'payment.action.invoice_request'}/></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paymentHistory.map((row) => (
                                <TableRow>
                                    <TableCell component="th" scope="row">{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>
                                    <TableCell align="right">{row.detail.currency}</TableCell>
                                    <TableCell align="right">{row.detail.method}</TableCell>
                                    <TableCell align="right">{row.detail.displayString}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleRequestInvoice(row)}>
                                            <RequestQuoteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            : <PBox>
                <Typography>
                    <FormattedMessage id={'payment.text.no_payments_yet'}/>
                </Typography>
            </PBox>
    );
}
