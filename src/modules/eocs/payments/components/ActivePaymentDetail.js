import {Box, Paper, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";

export function ActivePaymentDetail(){

    const authc = useContext(AuthContext);

    return (
        <Paper>
            <Box p={1}>
                <FormattedMessage id={'payment.text.payment_detail.active'}/><br/>
                {authc.manager.getUser().paymentDetails.map((detail,i) => (i == authc.manager.getUser().paymentDetails.length-1 &&
                    <Typography>{detail.method} - {detail.displayString} - {detail.status}</Typography>
                ))}

            </Box>
        </Paper>
    );
}
