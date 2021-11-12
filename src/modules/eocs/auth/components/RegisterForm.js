import {useLocation} from "react-router-dom";
import {FormattedMessage, useIntl} from "react-intl";
import {useNewUserFlow} from "../../home/services/NewUserFlow";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {UserManagerContext, UserType} from "../services/UserManagerProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {AgreeDialog, useAgreeDialog} from "../../../shared/components/AgreeDialog";
import camelize from "camelize";
import {switchMap} from "rxjs/operators";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {TH1} from "../../../shared/components/TH1";
import {Field, Form} from "react-final-form";
import {Box, Button} from "@mui/material";
import {TSubtitle1} from "../../../shared/components/TSubtitle1";
import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import {ButtonSubmit} from "../../../shared/components/ButtonSubmit";
import MuiPhoneNumber from "material-ui-phone-number";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import DateFnsUtils from "@date-io/date-fns";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {TKeyValueGrid} from "../../../shared/components/TKeyValueGrid";


const DialogTypes = {
    CONFIDENTIALITY: 'confidentiality',
}

export function RegisterForm(props){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);

    const [user, setUser] = useState(props.user);
    const [userType, setUserType] = useState(UserType.PRIVATE_INDIVIDUAL);

    const {open, checked, handleAgreeDialogOpen, handleAgreeDialogClose} = useAgreeDialog();

    useEffect(() => {
        console.log(444, props.user)
        setUser(props.user);
    }, [props.user]);

    const onSubmit = (formValue) => {
        if(user){
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
            {/*<TH1>
                <FormattedMessage id={'page.register'}/>
            </TH1>*/}

            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, mb: 1 }}>
                        {user && <>

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

                            <TKeyValueGrid
                                tkey={<Checkboxes name="consent_confidentiality"
                                                   required={true}
                                                   data={{
                                                       label: intl.formatMessage( {id: "auth.form.register.consent_confidentiality"}),
                                                       value: checked[DialogTypes.CONFIDENTIALITY]
                                                   }}
                                                   checked={checked[DialogTypes.CONFIDENTIALITY] === true}
                                />}
                                value={<Button onClick={() => handleAgreeDialogOpen(DialogTypes.CONFIDENTIALITY)}>{intl.formatMessage( {id: "auth.action.register.consent_confidentiality.open"})}</Button>}
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
