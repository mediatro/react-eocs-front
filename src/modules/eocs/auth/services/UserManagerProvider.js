import {QueryObserver, useQueryClient} from "react-query";
import {ApiService} from "../../../shared/services/ApiService";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {createContext, useContext} from "react";

export const UserType = {
    PRIVATE_INDIVIDUAL: 'private_individual',
    LEGAL_ENTITY: 'legal_entity',
}

const config = {
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

    doGetPreRegister(erpId){
        return this._fetch([this.config['api.users.path'].preReg, erpId].join('/'));
    }

    doPutRegister(user){
        //return this._fetch([this.config['api.users.path'][user.userType], user.erpId].join('/'), 'POST', JSON.stringify(user))
        return this._fetch(this.config['api.users.path'][user.userType], 'POST', JSON.stringify(user));
    }

    doGetUser(erpId){
        return this._fetch([this.config['api.users.path'].base,erpId].join('/'));
    }

    getPreRegisterQuery(erpId){
        return this.getObserver$({
            queryKey: ['get_preregister', erpId],
            queryFn: () => this.doGetPreRegister(erpId)
        });
    }

    getRegisterQuery(user){
        return this.getObserver$({
            queryKey: ['put_register', user],
            queryFn: () => this.doPutRegister(user)
        });
    }

    getUserQuery(username){
        return this.getObserver$({
            queryKey: ['get_user', username],
            queryFn: () => this.doGetUser(username)
        });
    }

    isUserVerified() {
        return this.authContext.manager.getUser()?.status === 'new';
    }

}

export const UserManagerContext = createContext({});

const manager = new UserManager();

export function UserManagerProvider(props){

    const queryClient = useQueryClient();
    const authc = useContext(AuthContext);

    manager.queryClient = queryClient;
    manager.authContext = authc;

    authc.manager.userChanged$.subscribe((user) =>{
       if(user && user.erpId && !user.id){
           manager.getUserQuery(user.erpId).subscribe((v) => {
               if(v.data && v.data.id){
                   authc.manager.setUser(v.data);
               }
           })
       }
    });

    return (
        <UserManagerContext.Provider value={{manager: manager}}>
            {props.children}
        </UserManagerContext.Provider>
    );

}
