import {Box, IconButton, List, ListItem, ListItemText, Paper, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {PBox} from "../../../shared/components/PBox";
import LoopIcon from '@mui/icons-material/Loop';
import {PaymentManagerContext} from "../services/PaymentProvider";

export function ActivePaymentDetail(){

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
                <Typography>
                    <FormattedMessage id={'payment.field.payment_detail.active'}/>
                </Typography>
            :
                detail.status === 'verified'
                    ?
                        <IconButton onClick={() => activateDetail(detail)}>
                            <LoopIcon/>
                        </IconButton>
                    :
                        null
    );

    return (
        <PBox>
            <Typography variant={'h4'}>
                <FormattedMessage id={'payment.text.payment_detail.list'}/>
            </Typography>

            <List>
                {authc.manager.getUser().paymentDetails.slice(0).reverse().map((detail, i) => (
                    <ListItem secondaryAction={getListAction(detail)}>
                        <ListItemText>
                            <Typography>{detail["@id"]} - {detail.displayString} - {detail.status}</Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </PBox>
    );
}
