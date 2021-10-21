import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import {Box, Button, Typography,} from "@mui/material";
import {Field, Form} from "react-final-form";
import MuiPhoneNumber from 'material-ui-phone-number';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {FormattedMessage, useIntl} from "react-intl";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {useContext, useState} from "react";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import {UserManagerContext, UserManagerProvider, UserType} from "../services/UserManagerProvider";
import camelize from 'camelize';
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";

const DialogTypes = {
    CONFIDENTIALITY: 'confidentiality',
}

export function RegisterPage(props){

    const intl = useIntl();
    const umc = useContext(UserManagerContext);
    const authc = useContext(AuthContext);
    const fic = useContext(FetchInterceptorContext);

    const [erpId, setErpId] = useState(null);
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(UserType.PRIVATE_INDIVIDUAL);

    const {open, checked, handleAgreeDialogOpen, handleAgreeDialogClose} = useAgreeDialog();

    const onSubmit = (formValue) => {
        if(!user){
            umc.manager.getPreRegisterQuery(erpId).subscribe((v) => {
                setUser(v.data);
            });
        }else{
            let nv = {...camelize(formValue),
                erpId: user.erpId,
                email: user.email,
                phone: user.phone,
                userType: userType,
            };
            umc.manager.getRegisterQuery(nv).subscribe((v) => {
                console.log(1111,v)
                if(v.isSuccess){
                    authc.manager.login(nv.email, nv.password);
                }
            });
        }
    };

    return (
        <Box sx={{width: 300}}>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        {!user ? <>
                            <Typography><FormattedMessage id={'auth.text.register.request_prereg'}/></Typography>

                            <TextField name="erp_id"
                                       label={intl.formatMessage( {id: "auth.field.user.erp_id"})}
                                       required={true}
                                       value={erpId}
                                       onChange={(e) => setErpId(e.target.value)}
                            />

                            <Button type="submit"
                                    disabled={fic.loading}
                            >
                                <FormattedMessage id={'auth.action.register.check_prereg'}/>
                            </Button>

                        </> : <>
                            <TextField  type={'email'}
                                        name="email"
                                        label={intl.formatMessage( {id: "auth.field.user.email"})}
                                        required={true}
                                        value={user.email}
                                        onChange={(e)=> {setUser({...user, email: e.target.value})}}
                            />
                            <TextField type={"password"}
                                       name="password"
                                       label={intl.formatMessage( {id: "auth.field.user.password"})}
                                       required={true}
                            />
                            <TextField type={"password"}
                                       name="password_repeat"
                                       label={intl.formatMessage( {id: "auth.field.user.password_repeat"})}
                                       required={true}
                            />

                            <Field name="phone">
                                { props => <MuiPhoneNumber defaultCountry={'us'}
                                                           name="phone"
                                                           label={intl.formatMessage( {id: "auth.field.user.phone"})}
                                                           required={true}
                                                           value={user.phone}
                                                           onChange={(e)=> {setUser({...user, phone: e})}}
                                /> }
                            </Field>
                            <CountrySelect name="country"
                                           label={intl.formatMessage( {id: "location.field.country"})}
                                           required={true}
                            />
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

                            {userType === UserType.PRIVATE_INDIVIDUAL && <>
                                <TextField name="first_name"
                                           label={intl.formatMessage( {id: "auth.field.user.first_name"})}
                                           required={true}
                                />
                                <TextField name="last_name"
                                           label={intl.formatMessage( {id: "auth.field.user.last_name"})}
                                           required={true}
                                />
                                <KeyboardDatePicker name="birthday"
                                                    label={intl.formatMessage( {id: "auth.field.user.birthday"})}
                                                    required={true}
                                                    openTo={"year"}
                                                    format={"dd.MM.yyyy"}
                                                    dateFunsUtils={DateFnsUtils}
                                />
                                <TextField name="city"
                                           label={intl.formatMessage( {id: "location.field.city"})}
                                           required={true}
                                />
                                <TextField name="address"
                                           label={intl.formatMessage( {id: "auth.field.user.address"})}
                                           required={true}
                                />
                            </>}

                            {userType === UserType.LEGAL_ENTITY && <>
                                <TextField name="company_reg_number"
                                           label={intl.formatMessage( {id: "auth.field.user.company_reg_number"})}
                                           required={true}
                                />
                                <TextField name="legal_representative_name"
                                           label={intl.formatMessage( {id: "auth.field.user.legal_representative_name"})}
                                           required={true}
                                />
                                <TextField name="legal_address"
                                           label={intl.formatMessage( {id: "auth.field.user.legal_address"})}
                                           required={true}
                                />
                            </>}

                            <Checkboxes name="consent_personal_data"
                                        label={intl.formatMessage( {id: "auth.form.register.consent_personal_data"})}
                                        required={true}
                                        data={{}}
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

                            <Button type="submit"
                                    variant="contained"
                                    disabled={fic.loading}
                            >
                                <FormattedMessage id={'auth.action.register.submit'}/>
                            </Button>
                        </>}
                    </form>
                )}
            />

            <AgreeDialog title={intl.formatMessage( {id: "auth.title.consent_confidentiality"})}
                         body={intl.formatMessage( {id: "auth.text.consent_confidentiality"})}
                         open={open === DialogTypes.CONFIDENTIALITY}
                         handleClose={handleAgreeDialogClose(DialogTypes.CONFIDENTIALITY)}
            />

        </Box>
    );
}

