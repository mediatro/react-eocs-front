import {PaymentDetailsPage} from "../modules/eocs/payments/components/PaymentDetailsPage";
import {PaymentRequestPage} from "../modules/eocs/payments/components/PaymentRequestPage";
import {LogoutPage} from "../modules/eocs/auth/components/LogoutPage";
import {RegisterPage} from "../modules/eocs/auth/components/RegisterPage";
import {LoginPage} from "../modules/eocs/auth/components/LoginPage";
import {HomePage} from "../modules/eocs/home/components/HomePage";

export const routes = [
    {
        path: '/payment-details',
        message: 'page.payment_details',
        component: PaymentDetailsPage,
        conditions: {authed: true},
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
