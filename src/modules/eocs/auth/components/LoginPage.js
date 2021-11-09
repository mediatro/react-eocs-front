import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import {Box, Button, FormControlLabel, Grid, Typography} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FormattedMessage, useIntl} from "react-intl";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {Link} from "react-router-dom";
import {ButtonSubmit} from "../../../shared/components/ButtonSubmit";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {TH1} from "../../../shared/components/TH1";

export function LoginPage(props){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const fic = useContext(FetchInterceptorContext);

    const onSubmit = (v) => {
        authc.manager.login(v.username, v.password).catch(reason => fic.setError(reason));
    };

    return (
        <ContainerSmall>
            <TH1>
                <FormattedMessage id={'page.login'}/>
            </TH1>

            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField name="username"
                                   label={intl.formatMessage({id: 'auth.field.user.email'})}
                                   required={true}
                                   autoComplete="email"
                                   fullWidth
                                   sx={{ mt: 2 }}
                        />
                        <TextField type="password"
                                   name="password"
                                   label={intl.formatMessage({id: 'auth.field.user.password'})}
                                   required={true}
                                   autoComplete="current-password"
                                   fullWidth
                                   sx={{ mt: 2 }}
                        />

                        <ButtonSubmit>
                            <FormattedMessage id={'auth.action.login.submit'}/>
                        </ButtonSubmit>

                        <Grid container>
                            <Grid item xs>
                                <Link to={'/password-reset'} variant="body2">
                                    <FormattedMessage id={'page.password_reset'}/>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={'/register'} variant="body2">
                                    <FormattedMessage id={'page.register'}/>
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            />
        </ContainerSmall>
    );
}
