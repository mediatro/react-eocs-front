import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import {Box, Button, Typography,} from "@mui/material";
import {Field, Form} from "react-final-form";
import MuiPhoneNumber from 'material-ui-phone-number';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {FormattedMessage, useIntl} from "react-intl";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {useContext, useEffect, useState} from "react";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import {UserManagerContext, UserManagerProvider, UserType} from "../services/UserManagerProvider";
import camelize from 'camelize';
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import { switchMap } from 'rxjs/operators';
import {useLocation} from "react-router-dom";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {TH1} from "../../../shared/components/TH1";
import {TSubtitle1} from "../../../shared/components/TSubtitle1";
import {ButtonSubmit} from "../../../shared/components/ButtonSubmit";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useNewUserFlow} from "../../home/services/NewUserFlow";
import {NewUserStepper} from "../../home/components/NewUserStepper";
import {HomePage} from "../../home/components/HomePage";

const DialogTypes = {
    CONFIDENTIALITY: 'confidentiality',
}

export function RegisterPage(props){

    let location = useLocation();
    const intl = useIntl();
    const flow = useNewUserFlow();
    const umc = useContext(UserManagerContext);

    const [erpId, setErpId] = useState(null);
    const [user, setUser] = useState(null);

    const fetchPreReg = (erpId) => {
        umc.manager.getPreRegisterQuery(erpId).subscribe((v) => {
            setUser(v.data);
        });
    }

    useEffect(() => {
        let idFromQuery = new URLSearchParams(location.search).get('erpId');
        if(idFromQuery) {
            setErpId(idFromQuery);
            fetchPreReg(idFromQuery)
        }
    }, []);

    const onSubmit = (formValue) => {
        if(!user){
           fetchPreReg(erpId);
        }
    };

    return (
        user
            ?
                <NewUserStepper user={user}/>
            :

        <ContainerSmall>
            <TH1>
                <FormattedMessage id={'page.register'}/>
            </TH1>

            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, mb: 1 }}>
                        {!user && <>
                            <TSubtitle1>
                                <FormattedMessage id={'auth.text.register.request_prereg'}/>
                            </TSubtitle1>

                            <TextField name="erp_id"
                                       label={intl.formatMessage( {id: "auth.field.user.erp_id"})}
                                       required={true}
                                       value={erpId}
                                       onChange={(e) => setErpId(e.target.value)}
                                       sx={{ mt: 1, mb: 1 }}
                            />

                            <ButtonSubmit>
                                <FormattedMessage id={'auth.action.register.check_prereg'}/>
                            </ButtonSubmit>
                        </>}
                    </Box>
            )}/>
        </ContainerSmall>
    );
}

