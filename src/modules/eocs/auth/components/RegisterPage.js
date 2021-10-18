import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import {Box, Button, Typography,} from "@mui/material";
import {Field, Form} from "react-final-form";
import MuiPhoneNumber from 'material-ui-phone-number';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {FormattedMessage, useIntl} from "react-intl";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {useContext, useState} from "react";
import {AgreeDialog} from "./AgreeDialog";
import {UserManagerContext, UserManagerProvider, UserTypes} from "../services/UserManagerProvider";
import camelize from 'camelize';
import {AuthContext} from "../../../shared/services/AuthProvider";

const DialogTypes = {
    OFFER: 'offer',
    CONFIDENTIALITY: 'confidentiality',
}

export function RegisterPage(props){

    const intl = useIntl();
    const umc = useContext(UserManagerContext);
    const authc = useContext(AuthContext);

    const [open, setOpen] = useState(false);
    const [erpId, setErpId] = useState(null);
    const [checked, setChecked] = useState({});
    const [user, setUser] = useState(null);

    const handleAgreeDialogOpen = (v) => {
        setOpen(v);
    };

    const handleAgreeDialogClose = (t) => {
        return (v) => {
            setOpen(false);
            let nc = checked;
            nc[t] = v;
            setChecked(nc);
        };
    };

    const onSubmit = (formValue) => {
        if(!user){
            umc.manager.getPreRegisterQuery(erpId).subscribe((v) => {
                setUser(v.data);
            });
        }else{
            let nv = {...camelize(formValue), erpId: user.erpId};
            umc.manager.getRegisterQuery(nv).subscribe((v) => {
                authc.manager.setUser(v);
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
                            <Typography><FormattedMessage id={'text.register.request_prereg'}/></Typography>

                            <TextField name="erp_id"
                                       label={intl.formatMessage( {id: "field.user.erp_id"})}
                                       required={true}
                                       value={erpId}
                                       onChange={(e) => setErpId(e.target.value)}
                            />

                            <Button type="submit"><FormattedMessage id={'action.register.check_prereg'}/></Button>

                        </> : <>

                            <TextField  type={'email'}
                                        name="email"
                                        label={intl.formatMessage( {id: "field.user.email"})}
                                        required={true}
                                        value={user.email}
                            />

                            <Field name="phone">
                                { props => <MuiPhoneNumber defaultCountry={'us'}
                                                           name="phone"
                                                           label={intl.formatMessage( {id: "field.user.phone"})}
                                                           required={true}
                                /> }
                            </Field>

                            <TextField type={"password"}
                                       name="password"
                                       label={intl.formatMessage( {id: "field.user.password"})}
                                       required={true}
                            />
                            <TextField type={"password"}
                                       name="password_repeat"
                                       label={intl.formatMessage( {id: "field.user.password_repeat"})}
                                       required={true}
                            />

                            <Select name="user_type"
                                    label={intl.formatMessage( {id: "field.user.user_type"})}
                                    required={true}
                                    data={Object.keys(UserTypes).map(k => ({
                                        label: intl.formatMessage({id: `field.user.user_type.${UserTypes[k]}`}),
                                        value: UserTypes[k]
                                    }))}
                            />


                            <TextField name="first_name"
                                       label={intl.formatMessage( {id: "field.user.first_name"})}
                                       required={true}
                            />
                            <TextField name="last_name"
                                       label={intl.formatMessage( {id: "field.user.last_name"})}
                                       required={true}
                            />

                            <KeyboardDatePicker name="birthday"
                                                label={intl.formatMessage( {id: "field.user.birthday"})}
                                                required={true}
                                                openTo={"year"}
                                                format={"dd.MM.yyyy"}
                                                dateFunsUtils={DateFnsUtils}
                            />

                            <CountrySelect name="country"
                                    label={intl.formatMessage( {id: "field.location.country"})}
                                    required={true}
                            />
                            <TextField name="city"
                                       label={intl.formatMessage( {id: "field.location.city"})}
                                       required={true}
                            />
                            <TextField name="address"
                                       label={intl.formatMessage( {id: "field.location.address"})}
                                       required={true}
                            />



                            <Checkboxes name="consent_personal_data"
                                        label={intl.formatMessage( {id: "form.register.consent_personal_data"})}
                                        required={true}
                                        data={{}}
                            />

                            <Button onClick={() => handleAgreeDialogOpen(DialogTypes.CONFIDENTIALITY)}>{intl.formatMessage( {id: "action.register.consent_confidentiality.open"})}</Button>

                            <Checkboxes name="consent_confidentiality"
                                        required={true}
                                        data={{
                                            label: intl.formatMessage( {id: "form.register.consent_confidentiality"}),
                                            value: checked[DialogTypes.CONFIDENTIALITY]
                                        }}
                                        checked={checked[DialogTypes.CONFIDENTIALITY] === true}
                            />

                            <Button onClick={() => handleAgreeDialogOpen(DialogTypes.OFFER)}>{intl.formatMessage( {id: "action.register.consent_offer.open"})}</Button>

                            <Checkboxes name="consent_offer"
                                        required={true}
                                        data={{
                                            label: intl.formatMessage( {id: "form.register.consent_offer"}),
                                            value: checked[DialogTypes.OFFER]
                                        }}
                                        checked={checked[DialogTypes.OFFER] === true}
                            />

                            <Button type="submit" variant="contained"><FormattedMessage id={'action.register.submit'}/></Button>
                        </>}
                    </form>
                )}
            />
            {user &&
                <AgreeDialog title={user.currentOffer.title}
                             body={user.currentOffer.body}
                             open={open === DialogTypes.OFFER}
                             handleClose={handleAgreeDialogClose(DialogTypes.OFFER)}
                />
            }

            <AgreeDialog title={intl.formatMessage( {id: "title.consent_confidentiality"})}
                         body={intl.formatMessage( {id: "text.consent_confidentiality"})}
                         open={open === DialogTypes.CONFIDENTIALITY}
                         handleClose={handleAgreeDialogClose(DialogTypes.CONFIDENTIALITY)}
            />

        </Box>
    );
}

