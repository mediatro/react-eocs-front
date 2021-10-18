import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import {Box, Button} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FormattedMessage, useIntl} from "react-intl";

export function LoginPage(props){

    const intl = useIntl();
    const authc = useContext(AuthContext);

    const onSubmit = (v) => {
        authc.manager.login(v.username, v.password);
    };

    return (
        <Box sx={{width: 300}}>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField name="username"
                                   label={intl.formatMessage({id: 'field.user.email'})}
                                   required={true}
                        />
                        <TextField type="password"
                                   name="password"
                                   label={intl.formatMessage({id: 'field.user.password'})}
                                   required={true}
                        />

                        <Button type="submit" variant="contained"><FormattedMessage id={'action.login.submit'}/></Button>
                    </form>
                )}
            />
        </Box>
    );
}
