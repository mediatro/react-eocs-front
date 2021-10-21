import {QueryObserver, useQueryClient} from "react-query";
import {ApiService} from "../../../shared/services/ApiService";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {createContext, useContext} from "react";
import {map} from "rxjs";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";

export const UserType = {
    PRIVATE_INDIVIDUAL: 'private_individual',
    LEGAL_ENTITY: 'legal_entity',
}

const config = {
    'api.offer_history.path': 'offer_history_records',
    'api.users.path': {
        base: 'users',
        preReg: 'user_pre_regs',
        [UserType.PRIVATE_INDIVIDUAL]: 'user_private_individuals',
        [UserType.LEGAL_ENTITY]: 'user_legal_entities',
    }
}

export class UserManager extends ApiService {

    constructor() {
        super();
        this.config = {...this.config, ...config}
    }

    getCurrentUser(){
        return this.authContext.manager.getUser();
    }

    doGetPreRegister(erpId){
        return this._fetch([this.config['api.users.path'].preReg, erpId].join('/'));
    }

    doPostRegister(user){
        return this._fetch(this.config['api.users.path'][user.userType], 'POST', JSON.stringify(user));
    }

    doGetUser(erpId){
        return this._fetch([this.config['api.users.path'].base,erpId].join('/'));
    }

    doPostConsentOffer(){
        return this._fetch(this.config['api.offer_history.path'], 'POST', JSON.stringify({
            user: this.getCurrentUser()['@id'],
            offer: this.getCurrentUser().currentOffer['@id'],
        }));
    }



    getPreRegisterQuery(erpId){
        return this.getObserver$({
            queryKey: ['get_preregister', erpId],
            queryFn: () => this.doGetPreRegister(erpId)
        });
    }

    getRegisterQuery(user){
        return this.getObserver$({
            queryKey: ['post_register', user],
            queryFn: () => this.doPostRegister(user)
        });
    }

    getUserQuery(erpId){
        return this.getObserver$({
            queryKey: ['get_user', erpId],
            queryFn: () => this.doGetUser(erpId)
        });
    }

    getConsentOfferQuery(){
        return this.getObserver$({
            queryKey: ['post_consent_offer', this.getCurrentUser()],
            queryFn: () => this.doPostConsentOffer()
        }).pipe(map((v)=>{
            this.reloadUser();
            return v;
        }));
    }



    isUserVerified() {
        return this.getCurrentUser()?.currentOffer;
    }

    isActiveOfferConfirmed(){
        if(!this.getCurrentUser() || !this.getCurrentUser().offersHistoryRecords){
            return false;
        }

        let ret = false;
        for (let record of this.getCurrentUser().offersHistoryRecords){
            if(record.offer['@id'] === this.getCurrentUser()?.currentOffer['@id']
            || record.offer === this.getCurrentUser()?.currentOffer['@id']){
                ret = true;
                break;
            }
        }
        return ret;
    }

    isPaymentRequestAvailable(){
        return this.isActiveOfferConfirmed() && this.getCurrentUser()?.activePaymentDetail
            && this.getCurrentUser()?.activePaymentDetail.status === 'verified';
    }

    reloadUser(){
        this.getUserQuery(this.getCurrentUser().erpId).subscribe((v) => {
            if(v.data && v.data.id){
                this.authContext.manager.setUser(v.data);
            }
        })
    }

}

export const UserManagerContext = createContext({});

const manager = new UserManager();

export function UserManagerProvider(props){

    const queryClient = useQueryClient();
    const authc = useContext(AuthContext);
    const fic = useContext(FetchInterceptorContext);

    manager.queryClient = queryClient;
    manager.authContext = authc;
    manager.interceptorContext = fic;

    authc.manager.userChanged$.subscribe((user) =>{
       if(user && user.erpId && !user.id){
           manager.reloadUser();
       }
    });

    return (
        <UserManagerContext.Provider value={{manager: manager}}>
            {props.children}
        </UserManagerContext.Provider>
    );

}
