import logo from './logo.svg';
import './App.css';
import {Layout} from "./eocs/layout/components/Layout";
import {AppRouting} from "./AppRouting";
import {createContext, useContext, useEffect} from "react";
import {I18NProvider} from "./shared/services/I18NProvider";
import {AuthProvider} from "./shared/services/AuthProvider";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {UserManagerProvider} from "./eocs/auth/services/UserManagerProvider";
import {PaymentManagerProvider} from "./eocs/payments/services/PaymentProvier";

const queryClient = new QueryClient({defaultOptions: {
    queries: {
        refetchOnWindowFocus: false,
    },
}});

function App() {


    let translationsEn = {
        'page.home': 'Home',
        'form.password': 'Password',
        'text.home.welcome.0': 'Welcome future partner!',
        'text.home.welcome.1': 'Before filling out a bid you need to register.',
    };

    let translationsRu = {
        'page.home': 'Главная',
        'form.password': 'Пароль',
        'text.home.welcome.0': 'Добро пожаловать!',
        'text.home.welcome.1': 'Для использования сервиса необходимо зарегистрироваться.',
    };

    let translations = {
        'en': translationsEn,
        'ru': translationsRu,
    };

    return (
            <I18NProvider translations={translations}>
                <QueryClientProvider client={queryClient}>
                    <UserManagerProvider>
                        <PaymentManagerProvider>
                            <AuthProvider>
                                <BrowserRouter>
                                            <Layout/>
                                </BrowserRouter>
                            </AuthProvider>
                        </PaymentManagerProvider>
                    </UserManagerProvider>
                </QueryClientProvider>
            </I18NProvider>

    );
}

export default App;
