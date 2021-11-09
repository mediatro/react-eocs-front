import {FormattedMessage, useIntl} from "react-intl";
import {Box, Button, List, ListItem, ListItemText, Typography} from "@mui/material";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import parse from "html-react-parser";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import {SPaper} from "../../../shared/components/SPaper";
import {TCardTitle} from "../../../shared/components/TCardTitle";

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

    const getListAction = (record) => {
        return (
            umc.manager.isActiveOfferConfirmed(record)
                ?
                    <Button color={'primary'}
                            onClick={() => handleAgreeDialogOpen(record['@id'])}
                    >
                        <FormattedMessage id={'home.action.offer_consent.review'}/>
                    </Button>
                :
                    <Button color={'warning'}
                            onClick={() => handleAgreeDialogOpen(record['@id'])}
                    >
                        <FormattedMessage id={'home.action.offer_consent.required'}/>
                    </Button>
        );
    }

    return(
        <SPaper>
            <TCardTitle>
                <FormattedMessage id={'home.text.offer_consent.title'}/>
            </TCardTitle>

            <List>
            {user.availableSiteRecords.map(record => (
                record &&
                    <ListItem secondaryAction={getListAction(record)}>
                        <ListItemText>
                            {record.site.name}
                        </ListItemText>


                        <Typography style={{display: 'inline'}} variant={'body2'}>

                        </Typography>



                        <AgreeDialog title={record.offer?.title}
                                     body={parse(record.offer?.body)}
                                     open={open === record['@id']}
                                     handleClose={handleAgreeDialogClose(record['@id'])}
                        />
                    </ListItem>
            ))}
            </List>
        </SPaper>
    );
}
