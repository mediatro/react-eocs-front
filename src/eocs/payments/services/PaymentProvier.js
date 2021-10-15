import {ApiService} from "../../../shared/services/ApiService";
import {useQueryClient} from "react-query";
import {UserManager, UserManagerContext} from "../../auth/services/UserManagerProvider";
import {createContext, useContext} from "react";

export const PaymentType = {
    WIRE_TRANSFER: 'wire_transfer',
    PSP: 'psp',
    CRYPTO: 'crypto',
    OCT: 'oct',
};

export const CurrencyType = {
    REAL: 'real',
    CRYPTO: 'crypto',
}

export const AvailableCurrencies = {
    [CurrencyType.REAL]: ['USD', 'EUR', 'RUB'],
    [CurrencyType.CRYPTO]: ['BTC', 'ETH', 'USDT'],
};

const config = {
    'api.payment_details.path': {
        [PaymentType.WIRE_TRANSFER]: 'payment_wire_details',
        [PaymentType.PSP]: 'payment_p_s_p_details',
        [PaymentType.CRYPTO]: 'payment_crypto_details',
        [PaymentType.OCT]: 'payment_o_c_t_details',
    }
};

export class PaymentManager extends ApiService {

    constructor() {
        super();
        this.config = {...this.config, ...config}
    }

    doPostPaymentDetails(details){
        return this._fetch(this.config['api.payment_details.path'][details.method], 'POST', JSON.stringify(details));
    }

    getCreatePaymentDetailsQuery(details){
        return this.getObserver({
            queryKey: ['post_payment_details', details],
            queryFn: () => this.doPostPaymentDetails(details)
        });
    }

}


export const PaymentManagerContext = createContext({});

const manager = new PaymentManager();

export function PaymentManagerProvider(props){

    const queryClient = useQueryClient();

    manager.qc = queryClient;

    return (
        <PaymentManagerContext.Provider value={{manager: manager}}>
            {props.children}
        </PaymentManagerContext.Provider>
    );

}
