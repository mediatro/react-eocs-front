import {createContext, useEffect, useState} from "react";
import fetchIntercept from 'fetch-intercept';

export const FetchInterceptorContext = createContext({});



export function FetchInterceptorProvider(props){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchIntercept.register({
            request: function (url, config) {
                // Modify the url or config here
                setLoading(true);
                setError(null)
                return [url, config];
            },

            requestError: function (error) {
                // Called when an error occured during another 'request' interceptor call
                setLoading(false);
                setError(error);
                return Promise.reject(error);
            },

            response: function (response) {
                // Modify the reponse object
                setLoading(false);
                return response;
            },

            responseError: function (error) {
                // Handle an fetch error
                setLoading(false);
                setError(error);
                return Promise.reject(error);
            }
        });
    }, []);

    return (
        <FetchInterceptorContext.Provider value={{
            loading: loading,
            error: error,
            setLoading: setLoading,
            setError: setError,
        }}>
            {props.children}
        </FetchInterceptorContext.Provider>
    );
}
