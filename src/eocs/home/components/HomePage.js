import {FormattedMessage} from "react-intl";
import {
    Box,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";

export function HomePage(props){

    const authc = useContext(AuthContext);

    return (
        <Box>
            {!authc.manager.getUser() ? <>
                <FormattedMessage id={'text.home.welcome.0'}/>
                <br/>
                <FormattedMessage id={'text.home.welcome.1'}/>
                <br/>
                <Link to={'/register'}>
                    <FormattedMessage id={'page.register'}/>
                </Link>
            </> : <>
                {authc.manager.isVerified() ? <>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>field.payment_history.date</TableCell>
                                    <TableCell align="right">field.payment_history.sum</TableCell>
                                    <TableCell align="right">field.payment_history.currency</TableCell>
                                    <TableCell align="right">field.payment_history.description</TableCell>
                                    <TableCell align="right">action.payment_history.invoice_request</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/*{rows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                ))}*/}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </> : <>
                    <FormattedMessage id={'text.home.wait_for_verification'}/>
                </>}
            </>}
        </Box>
    );
}
