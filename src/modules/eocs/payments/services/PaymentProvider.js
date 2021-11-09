import {ApiService} from "../../../shared/services/ApiService";
import {useQueryClient} from "react-query";
import {UserManager, UserManagerContext} from "../../auth/services/UserManagerProvider";
import {createContext, useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {map} from "rxjs";

export const Priority = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
}

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

export const BlockReason = {
    MONTH_END: 'month_end',
    REQUEST_ACTIVE: 'request_active',
    REQUEST_TOO_SOON: 'request_too_soon',
}

const config = {
    'api.payment.path': 'payments',
    'api.payment_methods.path': 'payment_methods',
    'api.payment_request.path': 'payment_requests',
    'api.invoice_request.path': 'invoice_requests',
    'api.payment_details.path': {
        [PaymentType.WIRE_TRANSFER]: 'payment_wire_details',
        [PaymentType.PSP]: 'payment_p_s_p_details',
        [PaymentType.CRYPTO]: 'payment_crypto_details',
        [PaymentType.OCT]: 'payment_o_c_t_details',
    }
};

export class PaymentManager extends ApiService {

    userManagerContext = null;

    constructor() {
        super();
        this.config = {...this.config, ...config}
    }

    doGetPaymentMethods(){
        return this._fetch(this.config['api.payment_methods.path'], 'GET');
    }

    doPostPaymentDetails(details, method){
        return this._fetch(this.config['api.payment_details.path'][method], 'POST', JSON.stringify(details));
    }

    doPostPaymentRequest(request){
        return this._fetch(this.config['api.payment_request.path'], 'POST', JSON.stringify(request));
    }

    doPatchPaymentRequest(request){
        return this._fetch([this.config['api.payment_request.path'], request.requestId].join('/'), 'PATCH', JSON.stringify(request));
    }

    doGetPayments(erpId){
        return this._fetch(`${this.config['api.payment.path']}?detail.user.erpId=${erpId}`, 'GET');
    }

    doPostInvoiceRequest(request){
        return this._fetch(this.config['api.invoice_request.path'], 'POST', JSON.stringify(request));
    }

    doPatchActivateDetail(detail){
        return this._fetch(this.getUser()['@id'].replace(/^\//, ''), 'PATCH', JSON.stringify({
            activePaymentDetail: detail['@id'],
        }));
    }


    getPaymentMethodsQuery(){
        return this.getObserver$({
            queryKey: 'get_methods',
            queryFn: () => this.doGetPaymentMethods()
        });
    }

    getCreatePaymentDetailsQuery(details, method){
        return this.getObserver$({
            queryKey: ['post_payment_details', details],
            queryFn: () => this.doPostPaymentDetails(details, method)
        }).pipe(map((v)=>{
            this.userManagerContext.manager.reloadUser();
            return v;
        }));
    }

    getCreatePaymentRequestQuery(request){
        return this.getObserver$({
            queryKey: ['post_payment_request', request],
            queryFn: () => this.doPostPaymentRequest(request)
        }).pipe(map((v)=>{
            this.userManagerContext.manager.reloadUser();
            return v;
        }));
    }

    getUpdatePaymentRequestQuery(request){
        return this.getObserver$({
            queryKey: ['patch_payment_request', request],
            queryFn: () => this.doPatchPaymentRequest(request)
        }).pipe(map((v)=>{
            this.userManagerContext.manager.reloadUser();
            return v;
        }));
    }

    getPaymentsQuery(erpId){
        return this.getObserver$({
            queryKey: ['get_payments', erpId],
            queryFn: () => this.doGetPayments(erpId)
        });
    }

    getCreateInvoiceRequestQuery(request){
        return this.getObserver$({
            queryKey: ['post_invoice_request', request],
            queryFn: () => this.doPostInvoiceRequest(request)
        });
    }

    getActivateDetailQuery(detail){
        return this.getObserver$({
            queryKey: ['patch_activate_detail', detail],
            queryFn: () => this.doPatchActivateDetail(detail)
        }).pipe(map((v)=>{
            this.userManagerContext.manager.reloadUser();
            return v;
        }));
    }




    getUser(){
        return this.userManagerContext.manager.getCurrentUser();
    }

    isPaymentRequestAvailable(){
        return this.userManagerContext.manager.isActiveOfferConfirmed()
            && this.getUser()?.activePaymentDetail
            && this.getUser()?.activePaymentDetail.status === 'verified';
    }

    isPaymentRequestBlocked(){
        //return false;
        let requests = this.getUser().activePaymentRequests;
        if(requests){
            for(let r of requests){
                console.log(22, r.status);
                if(['new', 'in-progress'].includes(r.status)) {
                    return BlockReason.REQUEST_ACTIVE;
                }else{
                    return BlockReason.REQUEST_TOO_SOON;
                }
            }
        }
        return false;
    }

    isPaymentDetailsBlocked(){
        //return false;
        if(!this.getUser().activePaymentDetail){
            return false;
        }
        let d = new Date();
        let currentDay = d.getDate();
        let totalDays =  new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
        return totalDays - currentDay < 15 ? BlockReason.MONTH_END : false;
    }

    hasPendingDetails(){
        for(let detail of this.getUser().paymentDetails){
            if(detail.status === 'new'){
                return true;
            }
        }
        return false;
    }

    getAvailablePriorities(){
        if(!this.getUser().paymentDetails){
            return [];
        }
        if(this.getUser().paymentDetails.length < 1){
            return [Priority.PRIMARY];
        }
        if(this.hasPendingDetails()){
            return [Priority.SECONDARY];
        }
        return Object.keys(Priority).map(k => Priority[k]);
    }

}


export const PaymentManagerContext = createContext({});

const manager = new PaymentManager();

export function PaymentManagerProvider(props){

    const queryClient = useQueryClient();
    const authc = useContext(AuthContext);
    const umc = useContext(UserManagerContext);
    const fic = useContext(FetchInterceptorContext);

    manager.queryClient = queryClient;
    manager.authContext = authc;
    manager.userManagerContext = umc;
    manager.interceptorContext = fic;

    return (
        <PaymentManagerContext.Provider value={{manager: manager}}>
            {props.children}
        </PaymentManagerContext.Provider>
    );

}
