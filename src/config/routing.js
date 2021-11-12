import {PaymentDetailsPage} from "../modules/eocs/payments/components/PaymentDetailsPage";
import {PaymentRequestPage} from "../modules/eocs/payments/components/PaymentRequestPage";
import {LogoutPage} from "../modules/eocs/auth/components/LogoutPage";
import {RegisterPage} from "../modules/eocs/auth/components/RegisterPage";
import {LoginPage} from "../modules/eocs/auth/components/LoginPage";
import {HomePage} from "../modules/eocs/home/components/HomePage";
import {PasswordResetPage} from "../modules/eocs/auth/components/PasswordResetPage";
import {PaymentRequestConfirmation} from "../modules/eocs/payments/components/PaymentRequestConfirmation";

import HomeIcon from '@mui/icons-material/Home'; //хоме
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'; //пеймент дитейлс
import LockOpenIcon from '@mui/icons-material/LockOpen'; //sign in
import LockIcon from '@mui/icons-material/Lock'; //sign out
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PaymentsIcon from '@mui/icons-material/Payments'; //пеймент реквест

export const routes = [
    {
        path: '/',
        message: 'page.home',
        component: HomePage,
        icon: HomeIcon,
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
        icon: AccountBalanceWalletIcon,
    },
    {
        path: '/payment-request',
        message: 'page.payment_request',
        component: PaymentRequestPage,
        conditions: {authed: true, verified: true},
        icon: PaymentsIcon,
    },

    {
        path: '/register',
        message: 'page.register',
        component: RegisterPage,
        conditions: {authed: false},
        icon: AppRegistrationIcon,
    },
    {
        path: '/login',
        message: 'page.login',
        component: LoginPage,
        conditions: {authed: false},
        icon: LockOpenIcon,
    },
    {
        path: '/password-reset',
        message: 'page.password_reset',
        component: PasswordResetPage,
        conditions: {authed: false},
        menu: false,
    },

    {
        path: '/logout',
        message: 'page.logout',
        component: LogoutPage,
        conditions: {authed: true},
        icon: LockIcon,
    },
];
