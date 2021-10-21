import React, {useContext} from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Link, useHistory
} from "react-router-dom";
import {HomePage} from "../modules/eocs/home/components/HomePage";
import {LoginPage} from "../modules/eocs/auth/components/LoginPage";
import {RegisterPage} from "../modules/eocs/auth/components/RegisterPage";
import {GuardedRoute, GuardProvider} from "react-router-guards";
import {AuthContext} from "../modules/shared/services/AuthProvider";
import {PaymentDetailsPage} from "../modules/eocs/payments/components/PaymentDetailsPage";
import {LogoutPage} from "../modules/eocs/auth/components/LogoutPage";
import {UserManagerContext, UserManagerProvider} from "../modules/eocs/auth/services/UserManagerProvider";
import {PaymentRequestPage} from "../modules/eocs/payments/components/PaymentRequestPage";
import {mergeWith} from "rxjs";
import {routes} from "../config/routing";


export function AppRouting(props){

    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const history = useHistory();

    authc.manager.userChanged$.pipe(mergeWith(authc.manager.loginRequested$)).subscribe(v => history.push('/'));

    const appGuard = (to, from, next) => {
        if (to.meta?.authed === true) {
            if (authc.manager.checkAuth()) {
                if (to.meta?.verified === true) {
                    if (umc.manager.isActiveOfferConfirmed()) {
                        next();
                    }
                    next.redirect('/');
                }
                next();
            }
            next.redirect('/login');
        } else if(to.meta?.authed === false){
            if (!authc.manager.getUser()) {
                next();
            }
            next.redirect('/');
        } else {
            next();
        }
    };

    return (
        <GuardProvider guards={[appGuard]} >
            <Switch>
                {routes.map(route => (
                    <GuardedRoute path={route.path} exact component={route.component} meta={route.conditions}/>
                ))}
            </Switch>
        </GuardProvider>
    );
}
