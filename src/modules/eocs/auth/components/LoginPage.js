import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import {Box, Button} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FormattedMessage, useIntl} from "react-intl";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";

export function LoginPage(props){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const fic = useContext(FetchInterceptorContext);

    const onSubmit = (v) => {
        authc.manager.login(v.username, v.password).catch(reason => fic.setError(reason));
    };

    return (
        <Box sx={{width: 300}}>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField name="username"
                                   label={intl.formatMessage({id: 'auth.field.user.email'})}
                                   required={true}
                        />
                        <TextField type="password"
                                   name="password"
                                   label={intl.formatMessage({id: 'auth.field.user.password'})}
                                   required={true}
                        />

                        <Box mt={2}>
                            <Button type="submit"
                                    variant="contained"
                                    disabled={fic.loading}
                            >
                                <FormattedMessage id={'auth.action.login.submit'}/>
                            </Button>
                        </Box>
                    </form>
                )}
            />
        </Box>
    );
}
