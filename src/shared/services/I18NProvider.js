import {createContext, useContext, useState} from "react";
import {IntlProvider} from "react-intl";

export const I18NContext = createContext(null);

export function I18NProvider(props){

    const [locale, setLocale] = useState('en');

    return (
        <I18NContext.Provider value={{locale: locale, setLocale: setLocale}}>
            <IntlProvider locale={locale} messages={props.translations[locale]}>
                {props.children}
            </IntlProvider>
        </I18NContext.Provider>
    );
}


