import {FormattedMessage, useIntl} from "react-intl";
import {Box, Button, Typography} from "@mui/material";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import parse from "html-react-parser";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import {PBox} from "../../../shared/components/PBox";

const DialogTypes = {
    OFFER: 'offer',
}

export function OfferConsent(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);

    const {open, checked, handleAgreeDialogOpen, handleAgreeDialogClose} = useAgreeDialog();

    const user = authc.manager.getUser();
    const availableSiteRecords = user.availableSiteRecords;

    useEffect(() => {
        for(let record of availableSiteRecords){
            if(record && !record.consented && checked[record['@id']]){
                umc.manager.getConsentOfferQuery(record).subscribe((v) => {
                    console.log(v);
                });
            }
        }
    }, [availableSiteRecords, JSON.stringify(checked)]);

    return(
        <Box>
            {user.availableSiteRecords.map(record => (
                record && <PBox>
                    <Typography>{record.site.name}</Typography>

                    <Typography>
                        {!umc.manager.isActiveOfferConfirmed(record)
                            ? <FormattedMessage id={'home.text.offer_consent_required'}/>
                            : <FormattedMessage id={'home.text.offer_consent_review'}/>
                        }
                    </Typography>

                    <Button
                        onClick={() => handleAgreeDialogOpen(record['@id'])}>{intl.formatMessage({id: "home.action.offer_consent.open_dialog"})}</Button>

                    <AgreeDialog title={record.offer?.title}
                                 body={parse(record.offer?.body)}
                                 open={open === record['@id']}
                                 handleClose={handleAgreeDialogClose(record['@id'])}
                    />
                </PBox>
            ))}
        </Box>
    );
}
