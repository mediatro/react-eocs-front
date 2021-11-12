import {
    Box, IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {SPaper} from "../../../shared/components/SPaper";
import {TH1} from "../../../shared/components/TH1";
import {MessageDefault} from "../../../shared/components/MessageDefault";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {TCardTitle} from "../../../shared/components/TCardTitle";
import {TStatus} from "../../../shared/components/TStatus";

export function ActivePaymentRequests(){

    const authc = useContext(AuthContext);

    return (
        <SPaper>
            <TCardTitle>
                <FormattedMessage id={'payment.text.payment_requests.active'}/>
            </TCardTitle>

            {authc.manager.getUser().activePaymentRequests && authc.manager.getUser().activePaymentRequests.length > 0
                ?
                    <TableContainer>
                        <Table sx={{minWidth: 650}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><FormattedMessage id={'payment.field.date'}/></TableCell>
                                    <TableCell align="right"><FormattedMessage id={'payment.field.site'}/></TableCell>
                                    <TableCell align="right"><FormattedMessage id={'payment.field.amount'}/></TableCell>
                                    <TableCell align="right"><FormattedMessage id={'payment.field.detail'}/></TableCell>
                                    <TableCell align="right"><FormattedMessage id={'payment.field.status'}/></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {authc.manager.getUser().activePaymentRequests.map((row) =>
                                    <TableRow>
                                        <TableCell component="th"
                                                   scope="row">{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">{row.siteHistoryRecord.site.name}</TableCell>
                                        <TableCell align="right">{row.amount}</TableCell>
                                        <TableCell align="right">{row.detail.displayString}</TableCell>
                                        <TableCell align="right">
                                            <TStatus status={row.status}>
                                                <FormattedMessage id={`payment.field.payment_request.status.${row.status}`}/>
                                            </TStatus>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                :
                    <MessageDefault>
                        <FormattedMessage id={'payment.text.no_payment_requests_yet'}/>
                    </MessageDefault>
            }
        </SPaper>
    );
}
