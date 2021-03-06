import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Table, TableBody, TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {SPaper} from "../../../shared/components/SPaper";
import LoopIcon from '@mui/icons-material/Loop';
import {PaymentManagerContext} from "../services/PaymentProvider";
import {TCardTitle} from "../../../shared/components/TCardTitle";
import {TStatus} from "../../../shared/components/TStatus";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

export function PaymentDetailsList(){

    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);

    const activateDetail = (detail) => {
        pmc.manager.getActivateDetailQuery(detail).subscribe((v) => {
            console.log(v);
        });
    }


    const getListAction = (detail) => (
        authc.manager.getUser().activePaymentDetail && authc.manager.getUser().activePaymentDetail['@id'] === detail['@id']
            ?

                <TStatus status={detail.status}>
                    <FormattedMessage id={'payment.field.payment_detail.active'}/>
                </TStatus>
            :
                detail.status === 'verified'
                    ?
                        <IconButton color={'primary'} onClick={() => activateDetail(detail)}>
                            <LoopIcon/>
                        </IconButton>
                    :
                        <TStatus status={detail.status}>
                            <FormattedMessage id={`payment.field.payment_detail.status.${detail.status}`}/>
                        </TStatus>
    );

    return (
        <SPaper>
            <TCardTitle>
                <FormattedMessage id={'payment.text.payment_detail.list'}/>
            </TCardTitle>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><FormattedMessage id={'payment.field.payment_detail.display_string'}/></TableCell>
                            <TableCell align="right"><FormattedMessage id={'payment.field.payment_detail.status'}/></TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authc.manager.getUser().paymentDetails.slice(0).reverse().map((detail, i) => (
                            <TableRow>
                                <TableCell component="th"
                                           scope="row">{detail.displayString}</TableCell>
                                <TableCell align="right">
                                    <TStatus status={detail.status}>
                                        <FormattedMessage id={`payment.field.payment_detail.status.${detail.status}`}/>
                                    </TStatus>
                                </TableCell>
                                <TableCell align="right">
                                    {authc.manager.getUser().activePaymentDetail && authc.manager.getUser().activePaymentDetail['@id'] === detail['@id']
                                        ?
                                            <Typography variant={'h6'}>
                                                <FormattedMessage id={'payment.field.payment_detail.active'}/>
                                            </Typography>
                                        :
                                            detail.status === 'verified' &&
                                                <IconButton color={'primary'} onClick={() => activateDetail(detail)}>
                                                    <LoopIcon/>
                                                </IconButton>
                                    }

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/*<List>
                {authc.manager.getUser().paymentDetails.slice(0).reverse().map((detail, i) => (
                    <ListItem secondaryAction={getListAction(detail)}>
                        <ListItemText>
                            <Typography>{detail.displayString}</Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>*/}
        </SPaper>
    );
}
