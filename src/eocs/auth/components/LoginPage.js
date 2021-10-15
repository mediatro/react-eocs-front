import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import {Box, Button} from "@mui/material";
import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";

export function LoginPage(props){

    const authc = useContext(AuthContext);

    const onSubmit = (v) => {
        authc.manager.login(v.username);
    };

    return (
        <Box sx={{width: 300}}>
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <TextField name="username"
                                   label="field.user.email"
                                   required={true}
                        />
                        <TextField type="password"
                                   name="password"
                                   label="field.user.password"
                                   required={true}
                        />

                        <Button type="submit" variant="contained">action.login.submit</Button>
                    </form>
                )}
            />
        </Box>
    );
}
