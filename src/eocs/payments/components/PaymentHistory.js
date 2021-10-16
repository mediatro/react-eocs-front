import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PaymentManagerContext} from "../services/PaymentProvier";
import {useIntl} from "react-intl";
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import camelize from "camelize";

export function PaymentHistory(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);

    const [paymentHistory, setPaymentHistory] = useState([]);

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
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>field.payment.date</TableCell>
                        <TableCell align="right">field.payment.amount</TableCell>
                        <TableCell align="right">field.payment_details.currency</TableCell>
                        <TableCell align="right">field.payment_details.method</TableCell>
                        <TableCell align="right">action.payment.invoice_request</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentHistory.map((row) => (
                        <TableRow>
                            <TableCell component="th" scope="row">date</TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
                            <TableCell align="right">{row.detail.currency}</TableCell>
                            <TableCell align="right">{row.detail.method}</TableCell>
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
    );
}
