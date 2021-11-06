import {Box, Button, Typography} from "@mui/material";
import {Field, Form} from "react-final-form";
import {TextField} from "mui-rff";
import {FormattedMessage, useIntl} from "react-intl";
import {useContext, useEffect, useState} from "react";
import {UserManagerContext} from "../services/UserManagerProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {switchMap} from "rxjs/operators";
import {Link, useLocation} from "react-router-dom";

export function PasswordResetPage(){

    let location = useLocation();
    const intl = useIntl();
    const umc = useContext(UserManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        let tokenFromQuery = new URLSearchParams(location.search).get('token');
        if(tokenFromQuery) {
            setToken(tokenFromQuery);
        }
    }, []);

    const onSubmit = (formValue) => {
        if(token){
            umc.manager.getResetPasswordExecuteQuery({...formValue,
                token: token,
            }).subscribe((v) => {
                console.log(v);
                if(v.isSuccess){
                    setSuccess(true);
                }
            });
        }else{
            umc.manager.getResetPasswordRequestQuery(formValue.email).subscribe((v) => {
                console.log(v);
                if(v.isSuccess){
                    setSuccess(true);
                }
            });
        }
    }

    const renderRequest = () => (
        success
            ?
                <Typography>
                    <FormattedMessage id={'auth.text.password_reset.request.success'}/>
                </Typography>
            :<>
                <Typography>
                    <FormattedMessage id={'auth.text.password_reset.request.instructions'}/>
                </Typography>

                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit}>
                            <TextField  type={'email'}
                                        name="email"
                                        label={intl.formatMessage( {id: "auth.field.user.email"})}
                                        required={true}
                            />

                            <Button type="submit"
                                    disabled={fic.loading}
                            >
                                <FormattedMessage id={'auth.action.password_reset.request'}/>
                            </Button>
                        </form>
                    )}
                />
            </>
    );

    const renderExecute = () => (
        success
            ? <>
                <Typography>
                    <FormattedMessage id={'auth.text.password_reset.execute.success'}/>
                </Typography>

                <Typography>
                    <Link to={'/login'}>
                        <FormattedMessage id={'page.login'}/>
                    </Link>
                </Typography>
            </> : <>
                <Typography>
                    <FormattedMessage id={'auth.text.password_reset.execute.instructions'}/>
                </Typography>

                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit, values }) => (
                        <form onSubmit={handleSubmit}>
                            <TextField type={"password"}
                                       name="newPassword"
                                       label={intl.formatMessage( {id: "auth.field.user.password"})}
                                       required={true}
                            />
                            <TextField type={"password"}
                                       name="password_repeat"
                                       label={intl.formatMessage( {id: "auth.field.user.password_repeat"})}
                                       required={true}
                            />

                            <Button type="submit"
                                    disabled={fic.loading}
                            >
                                <FormattedMessage id={'auth.action.password_reset.execute'}/>
                            </Button>
                        </form>
                    )}
                />
            </>
    );

    return (
        <Box sx={{width: 400}}>
            {!token ? renderRequest() : renderExecute()}
        </Box>
    );
}
