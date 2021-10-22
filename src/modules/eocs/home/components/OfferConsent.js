import {FormattedMessage, useIntl} from "react-intl";
import {Box, Button, Typography} from "@mui/material";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import parse from "html-react-parser";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";

const DialogTypes = {
    OFFER: 'offer',
}

export function OfferConsent(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);

    const {open, checked, handleAgreeDialogOpen, handleAgreeDialogClose} = useAgreeDialog();

    const user = authc.manager.getUser();
    const isChecked = checked[DialogTypes.OFFER];

    useEffect(() => {
        if(isChecked && !umc.manager.isActiveOfferConfirmed()){
            umc.manager.getConsentOfferQuery().subscribe((v) => {
                console.log(v);
            });
        }
    }, [isChecked]);

    return(
        <Box>
            <Typography>
                {!umc.manager.isActiveOfferConfirmed()
                    ? <FormattedMessage id={'home.text.offer_consent_required'}/>
                    : <FormattedMessage id={'home.text.offer_consent_review'}/>
                }
            </Typography>

            <Button onClick={() => handleAgreeDialogOpen(DialogTypes.OFFER)}>{intl.formatMessage( {id: "home.action.offer_consent.open_dialog"})}</Button>

            <AgreeDialog title={user.currentOffer?.title}
                         body={parse(user.currentOffer?.body)}
                         open={open === DialogTypes.OFFER}
                         handleClose={handleAgreeDialogClose(DialogTypes.OFFER)}
            />
        </Box>
    );
}
