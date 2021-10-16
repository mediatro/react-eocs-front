import React, {useContext} from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Link, useHistory
} from "react-router-dom";
import {HomePage} from "./eocs/home/components/HomePage";
import {LoginPage} from "./eocs/auth/components/LoginPage";
import {RegisterPage} from "./eocs/auth/components/RegisterPage";
import {GuardedRoute, GuardProvider} from "react-router-guards";
import {AuthContext} from "./shared/services/AuthProvider";
import {PaymentDetailsPage} from "./eocs/payments/components/PaymentDetailsPage";
import {LogoutPage} from "./eocs/auth/components/LogoutPage";
import {UserManagerProvider} from "./eocs/auth/services/UserManagerProvider";
import {PaymentRequestPage} from "./eocs/payments/components/PaymentRequestPage";

export const routes = [
    {
        path: '/payment-details',
        message: 'page.payment_details',
        component: PaymentDetailsPage,
        conditions: {authed: true, verified: true},
    },
    {
        path: '/payment-request',
        message: 'page.payment_request',
        component: PaymentRequestPage,
        conditions: {authed: true, verified: true},
    },
    {
        path: '/logout',
        message: 'page.logout',
        component: LogoutPage,
        conditions: {authed: true},
    },

    {
        path: '/register',
        message: 'page.register',
        component: RegisterPage,
        conditions: {authed: false},
    },
    {
        path: '/login',
        message: 'page.login',
        component: LoginPage,
        conditions: {authed: false},
    },

    {
        path: '/',
        message: 'page.home',
        component: HomePage,
    },
];

export function AppRouting(props){

    const authc = useContext(AuthContext);
    const history = useHistory();

    authc.manager.userChanged$.subscribe(v => history.push('/'));

    const appGuard = (to, from, next) => {

        if (to.meta?.authed === true) {
            if (authc.manager.getUser()) {
                if (to.meta?.verified === true) {
                    if (true) {
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
