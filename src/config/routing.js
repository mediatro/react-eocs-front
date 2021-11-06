import {PaymentDetailsPage} from "../modules/eocs/payments/components/PaymentDetailsPage";
import {PaymentRequestPage} from "../modules/eocs/payments/components/PaymentRequestPage";
import {LogoutPage} from "../modules/eocs/auth/components/LogoutPage";
import {RegisterPage} from "../modules/eocs/auth/components/RegisterPage";
import {LoginPage} from "../modules/eocs/auth/components/LoginPage";
import {HomePage} from "../modules/eocs/home/components/HomePage";
import {PasswordResetPage} from "../modules/eocs/auth/components/PasswordResetPage";
import {PaymentRequestConfirmation} from "../modules/eocs/payments/components/PaymentRequestConfirmation";

export const routes = [
    {
        path: '/',
        message: 'page.home',
        component: HomePage,
    },
    {
        path: '/payment-request-confirmation',
        message: 'page.payment_request_confirmation',
        component: PaymentRequestConfirmation,
        conditions: {authed: true},
        menu: false,
    },
    {
        path: '/payment-details',
        message: 'page.payment_details',
        component: PaymentDetailsPage,
        conditions: {authed: true, initiated: true},
    },
    {
        path: '/payment-request',
        message: 'page.payment_request',
        component: PaymentRequestPage,
        conditions: {authed: true, verified: true},
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
        path: '/password-reset',
        message: 'page.password_reset',
        component: PasswordResetPage,
        conditions: {authed: false},
    },

    {
        path: '/logout',
        message: 'page.logout',
        component: LogoutPage,
        conditions: {authed: true},
    },
];
