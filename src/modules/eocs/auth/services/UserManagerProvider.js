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
    'api.image.path': 'media_objects',
    'api.reset_password.path': 'reset_password_requests',
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
        return this._fetch([this.config['api.users.path'].base, erpId].join('/'));
    }

    doPatchUser(user){
        return this._fetch([this.config['api.users.path'].base, user.erpId].join('/'), 'PATCH', JSON.stringify(user));
    }

    doPatchConsentOffer(record){
        return this._fetch(record['@id'].replace(/^\//, ''), 'PATCH', JSON.stringify({
            consented: true,
        }));
    }

    doPostImage(payload){
        return this._fetch(this.config['api.image.path'], 'POST', payload, true);
    }

    doPostResetPasswordRequest(email){
        return this._fetch(this.config['api.reset_password.path'], 'POST', JSON.stringify({email: email}));
    }

    doPatchResetPasswordRequest(request){
        return this._fetch([this.config['api.reset_password.path'], request.token].join('/'), 'PATCH', JSON.stringify(request));
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

    getUpdateUserQuery(user){
        return this.getObserver$({
            queryKey: ['patch_user', user],
            queryFn: () => this.doPatchUser(user)
        }).pipe(map((v) => {
            this.reloadUser();
            return v;
        }));
    }

    getConsentOfferQuery(record){
        return this.getObserver$({
            queryKey: ['patch_consent_offer', record],
            queryFn: () => this.doPatchConsentOffer(record)
        }).pipe(map((v) => {
            this.reloadUser();
            return v;
        }));
    }

    getPostImageQuery(payload){
        return this.getObserver$({
            queryKey: ['post_image', payload],
            queryFn: () => this.doPostImage(payload)
        });
    }

    getResetPasswordRequestQuery(email){
        return this.getObserver$({
            queryKey: ['post_reset_password_request', email],
            queryFn: () => this.doPostResetPasswordRequest(email)
        });
    }

    getResetPasswordExecuteQuery(request){
        return this.getObserver$({
            queryKey: ['patch_reset_password_execute', request],
            queryFn: () => this.doPatchResetPasswordRequest(request)
        });
    }




    isUserVerified() {
        return this.getCurrentUser()?.availableSiteRecords.length > 0;
    }

    isActiveOfferConfirmed(record){
        if(!this.getCurrentUser()){
            return false;
        }
        if(!record){
            return true;
        }

        return record.consented;


        //--------

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
