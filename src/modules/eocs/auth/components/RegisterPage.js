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

const DialogTypes = {
    CONFIDENTIALITY: 'confidentiality',
}

export function RegisterPage(props){

    const intl = useIntl();
    let location = useLocation();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const [erpId, setErpId] = useState(null);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(UserType.PRIVATE_INDIVIDUAL);

    const {open, checked, handleAgreeDialogOpen, handleAgreeDialogClose} = useAgreeDialog();

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
        }else{
            const payload = new FormData();
            payload.append("file", formValue.image[0]);

            let nv = {...camelize(formValue),
                erpId: user.erpId,
                email: user.email,
                phone: user.phone,
                userType: userType,
            };

            umc.manager.getPostImageQuery(payload).pipe(switchMap((v) => {
                nv.image = v.isSuccess ? v.data["@id"] : null;
                return umc.manager.getRegisterQuery(nv);
            })).subscribe((v) => {
                console.log(v);
                if(v.isSuccess){
                    authc.manager.login(nv.email, nv.password);
                }
            });
        }
    };

    return (
        <ContainerSmall>
            <TH1>
                <FormattedMessage id={'page.register'}/>
            </TH1>

            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, mb: 1 }}>
                        {!user ? <>

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

                        </> : <>

                            <TextField  type={'email'}
                                        name="email"
                                        label={intl.formatMessage( {id: "auth.field.user.email"})}
                                        required={true}
                                        value={user.email}
                                        onChange={(e)=> {setUser({...user, email: e.target.value})}}
                                        sx={{ mt: 1, mb: 1 }}
                            />
                            <TextField type={"password"}
                                       name="password"
                                       label={intl.formatMessage( {id: "auth.field.user.password"})}
                                       required={true}
                                       sx={{ mt: 1, mb: 1 }}
                            />
                            <TextField type={"password"}
                                       name="password_repeat"
                                       label={intl.formatMessage( {id: "auth.field.user.password_repeat"})}
                                       required={true}
                                       sx={{ mt: 1, mb: 1 }}
                            />
                            <Field name="phone">
                                { props => <MuiPhoneNumber defaultCountry={'us'}
                                                           name="phone"
                                                           label={intl.formatMessage( {id: "auth.field.user.phone"})}
                                                           value={user.phone}
                                                           onChange={(e)=> {setUser({...user, phone: e})}}
                                                           variant={'outlined'}
                                                           fullWidth={true}
                                                           sx={{ mt: 1, mb: 1 }}
                                /> }
                            </Field>
                            <Box sx={{ mt: 1, mb: 1 }}>
                                <CountrySelect name="country"
                                               label={intl.formatMessage( {id: "location.field.country"})}
                                               required={true}
                                />
                            </Box>

                            <Box sx={{ mt: 4, mb: 3 }}>
                                <Select name="user_type"
                                        label={intl.formatMessage( {id: "auth.field.user.user_type"})}
                                        required={true}
                                        value={userType}
                                        onChange={(e)=> {setUserType(e.target.value)}}
                                        data={Object.keys(UserType).map(k => ({
                                            label: intl.formatMessage({id: `auth.field.user.user_type.${UserType[k]}`}),
                                            value: UserType[k]
                                        }))}
                                />
                            </Box>

                            {userType === UserType.PRIVATE_INDIVIDUAL && <>
                                <TextField name="first_name"
                                           label={intl.formatMessage( {id: "auth.field.user.first_name"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                                <TextField name="last_name"
                                           label={intl.formatMessage( {id: "auth.field.user.last_name"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                                <Box sx={{ mt: 1, mb: 1 }}>
                                    <KeyboardDatePicker name="birthday"
                                                        label={intl.formatMessage( {id: "auth.field.user.birthday"})}
                                                        required={true}
                                                        openTo={"year"}
                                                        format={"dd.MM.yyyy"}
                                                        dateFunsUtils={DateFnsUtils}
                                                        sx={{ mt: 2 }}
                                    />
                                </Box>
                                <TextField name="city"
                                           label={intl.formatMessage( {id: "location.field.city"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                                <TextField name="address"
                                           label={intl.formatMessage( {id: "auth.field.user.address"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                            </>}

                            {userType === UserType.LEGAL_ENTITY && <>
                                <TextField name="company_reg_number"
                                           label={intl.formatMessage( {id: "auth.field.user.company_reg_number"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                                <TextField name="legal_representative_name"
                                           label={intl.formatMessage( {id: "auth.field.user.legal_representative_name"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                                <TextField name="legal_address"
                                           label={intl.formatMessage( {id: "auth.field.user.legal_address"})}
                                           required={true}
                                           sx={{ mt: 1, mb: 1 }}
                                />
                            </>}

                            <Checkboxes name="consent_personal_data"
                                        required={true}
                                        data={{
                                            label: intl.formatMessage( {id: "auth.form.register.consent_personal_data"}),
                                            value: true
                                        }}
                            />

                            <Button onClick={() => handleAgreeDialogOpen(DialogTypes.CONFIDENTIALITY)}>{intl.formatMessage( {id: "auth.action.register.consent_confidentiality.open"})}</Button>

                            <Checkboxes name="consent_confidentiality"
                                        required={true}
                                        data={{
                                            label: intl.formatMessage( {id: "auth.form.register.consent_confidentiality"}),
                                            value: checked[DialogTypes.CONFIDENTIALITY]
                                        }}
                                        checked={checked[DialogTypes.CONFIDENTIALITY] === true}
                            />

                            <Field name="image">
                                {({ input: { value, onChange, ...input } }) => (
                                    <label htmlFor="image">
                                        <input
                                            {...input}
                                            accept="image/*"
                                            type="file"
                                            name={"image"}
                                            id={"image"}
                                            required={"true"}
                                            onChange={({ target }) => onChange(target.files)} // instead of the default target.value
                                            style={{display: 'none'}}
                                        />
                                        <Button component={'span'}
                                                startIcon={<FileUploadIcon />}>
                                            <FormattedMessage id={'auth.field.user.image'}/>
                                        </Button>
                                    </label>
                                )}
                             </Field>

                            <ButtonSubmit>
                                <FormattedMessage id={'auth.action.register.submit'}/>
                            </ButtonSubmit>
                        </>}
                    </Box>
                )}
            />

            <AgreeDialog title={intl.formatMessage( {id: "auth.title.consent_confidentiality"})}
                         body={<pre style={{whiteSpace: 'pre-wrap'}}>{intl.formatMessage( {id: "auth.text.consent_confidentiality"})}</pre>}
                         open={open === DialogTypes.CONFIDENTIALITY}
                         handleClose={handleAgreeDialogClose(DialogTypes.CONFIDENTIALITY)}
            />

        </ContainerSmall>
    );
}

