import {Box, Button, Typography} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Checkboxes, KeyboardDatePicker, Select, TextField} from "mui-rff";
import {Field, Form} from "react-final-form";
import MuiPhoneNumber from "material-ui-phone-number";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {UserManagerContext, UserType} from "../services/UserManagerProvider";
import DateFnsUtils from "@date-io/date-fns";
import {useLocation} from "react-router-dom";
import {useContext, useState} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {switchMap} from "rxjs/operators";
import {ButtonSubmit} from "../../../shared/components/ButtonSubmit";
import {TCardTitle} from "../../../shared/components/TCardTitle";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {ButtonAction} from "../../../shared/components/ButtonAction";
import {TKeyValue} from "../../../shared/components/TKeyValue";


export function Profile(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const user = authc.manager.getUser();
    const userType = user.userType;

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: user.phone,
        //country: user.country,
    });

    const mergeFormData = (partial) => {
        setFormData({...formData, ...partial});
    }

    const onSubmit = (formValue) => {
        let nv = {...formValue,
            ...formData,
            status: 'updated'
        }
        umc.manager.getUpdateUserQuery(nv).subscribe((v) => {
            if(v.isSuccess){
                console.log(v);
                setEditing(false);
            }
        });
    }

    const toggleEditing = () => {
        setEditing(!editing);
    }

    return (
        <>
            <TCardTitle>
                <FormattedMessage id={'auth.text.profile'}/>
            </TCardTitle>

            {!editing
                ? <>
                    <TKeyValue
                        tkey={<FormattedMessage id={'auth.field.user.erp_id'}/>}
                        value={authc.manager.getUser().erpId}
                    />

                    {authc.manager.getUser().userType === UserType.PRIVATE_INDIVIDUAL &&
                        <TKeyValue
                            tkey={<FormattedMessage id={'auth.field.user.full_name'}/>}
                            value={<>{authc.manager.getUser().firstName} {authc.manager.getUser().lastName}</>}
                        />
                    }

                    <ButtonAction onClick={toggleEditing}>
                        {'auth.action.profile.edit'}
                    </ButtonAction>

                </> :
                <ContainerSmall>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={(
                            ({
                                 erpId,
                                 phone,
                                 country,
                                 firstName,
                                 lastName,
                                 city,
                                 address,
                                 companyRegNumber,
                                 legalRepresentativeName,
                                 legalAddress
                             }) =>
                                ({
                                    erpId,
                                    phone,
                                    country,
                                    firstName,
                                    lastName,
                                    city,
                                    address,
                                    companyRegNumber,
                                    legalRepresentativeName,
                                    legalAddress
                                })
                        )(user)}
                        render={({handleSubmit, values}) => (
                            <form onSubmit={handleSubmit}>

                                <Field name="phone">
                                    {props => <MuiPhoneNumber defaultCountry={'us'}
                                                              name="phone"
                                                              label={intl.formatMessage({id: "auth.field.user.phone"})}
                                                              variant={'outlined'}
                                                              fullWidth={true}
                                                              sx={{ mt: 1, mb: 1 }}
                                                              value={formData.phone}
                                                              onChange={(e)=> {mergeFormData({phone: e})}}
                                    />}
                                </Field>

                                <CountrySelect name="country"
                                               label={intl.formatMessage({id: "location.field.country"})}
                                               required={true}
                                />

                                {userType === UserType.PRIVATE_INDIVIDUAL && <>
                                    <TextField name="firstName"
                                               label={intl.formatMessage({id: "auth.field.user.first_name"})}
                                               required={true}
                                               defaultValue={user.firstName}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                    <TextField name="lastName"
                                               label={intl.formatMessage({id: "auth.field.user.last_name"})}
                                               required={true}
                                               defaultValue={user.lastName}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                    <TextField name="city"
                                               label={intl.formatMessage({id: "location.field.city"})}
                                               required={true}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                    <TextField name="address"
                                               label={intl.formatMessage({id: "auth.field.user.address"})}
                                               required={true}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                </>}

                                {userType === UserType.LEGAL_ENTITY && <>
                                    <TextField name="companyRegNumber"
                                               label={intl.formatMessage({id: "auth.field.user.company_reg_number"})}
                                               required={true}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                    <TextField name="legalRepresentativeName"
                                               label={intl.formatMessage({id: "auth.field.user.legal_representative_name"})}
                                               required={true}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                    <TextField name="legalAddress"
                                               label={intl.formatMessage({id: "auth.field.user.legal_address"})}
                                               required={true}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                </>}


                                <ButtonSubmit>
                                    <FormattedMessage id={'auth.action.register.submit'}/>
                                </ButtonSubmit>
                            </form>
                        )}
                    />
                </ContainerSmall>
            }
        </>
    );
}
