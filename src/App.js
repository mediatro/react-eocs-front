import logo from './logo.svg';
import './App.css';
import {Layout} from "./modules/eocs/layout/components/Layout";
import {AppRouting} from "./services/AppRouting";
import {createContext, useContext, useEffect} from "react";
import {I18NProvider} from "./modules/shared/services/I18NProvider";
import {AuthProvider} from "./modules/shared/services/AuthProvider";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {UserManagerProvider} from "./modules/eocs/auth/services/UserManagerProvider";
import {PaymentManagerProvider} from "./modules/eocs/payments/services/PaymentProvier";
import {FetchInterceptorProvider} from "./modules/shared/services/FetchInterceptorProvider";

import extractedTrans from './config/translations/extracted.json';
import manualTrans from './config/translations/manual.json';


const queryClient = new QueryClient({defaultOptions: {
    queries: {
        retry: false,
        refetchOnWindowFocus: false,
    },
}});


function App() {

    let translationMap = {
        en: {},
        ru: {},
    };

    let translations = {...extractedTrans, ...manualTrans};

    for(let k in translations){
        translationMap.en[k] = translations[k].en ? translations[k].en : k;
        translationMap.ru[k] = translations[k].ru ? translations[k].ru : k;
    }

    return (
            <I18NProvider translations={translationMap}>
                <FetchInterceptorProvider>
                    <QueryClientProvider client={queryClient}>
                        <BrowserRouter>
                            <AuthProvider>
                                <UserManagerProvider>
                                    <PaymentManagerProvider>
                                            <Layout/>
                                    </PaymentManagerProvider>
                                </UserManagerProvider>
                            </AuthProvider>
                        </BrowserRouter>
                    </QueryClientProvider>
                </FetchInterceptorProvider>
            </I18NProvider>
    );
}

export default App;
