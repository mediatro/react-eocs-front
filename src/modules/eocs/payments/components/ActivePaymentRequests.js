import {Box, Paper, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";

export function ActivePaymentRequests(){

    const authc = useContext(AuthContext);

    return (
        <Paper>
            <Box p={1}>
                <Typography>
                    <FormattedMessage id={'payment.text.payment_requests.active'}/>
                </Typography>
                {authc.manager.getUser().activePaymentRequests.map((request) =>
                    <Typography>
                        {request.detail.currency} {request.amount} - {request.status}<br/>
                        {request.detail.method} - {request.detail.displayString}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}
