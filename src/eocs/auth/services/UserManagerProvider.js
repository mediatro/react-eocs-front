import {QueryObserver, useQueryClient} from "react-query";
import {ApiService} from "../../../shared/services/ApiService";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {createContext, useContext} from "react";

export const UserTypes = {
    PRIVATE_INDIVIDUAL: 'private_individual',
    LEGAL_ENTITY: 'legal_entity',
}

const config = {
    'api.users.path': 'users',
}

export class UserManager extends ApiService {

    constructor() {
        super();
        this.config = {...this.config, ...config}
    }

    doGetPreRegister(erpId){
        return this._fetch([this.config['api.users.path'], erpId].join('/'));
    }

    doPutRegister(user){
        return this._fetch([this.config['api.users.path'], user.erpId].join('/'), 'PUT', JSON.stringify(user))
    }

    doGetUser(username){
        return this._fetch(`${this.config['api.users.path']}?email=${username}`);
    }

    getPreRegisterQuery(erpId){
        return this.getObserver({
            queryKey: ['get_preregister', erpId],
            queryFn: () => this.doGetPreRegister(erpId)
        });
    }

    getRegisterQuery(user){
        return this.getObserver({
            queryKey: ['put_register', user],
            queryFn: () => this.doPutRegister(user)
        });
    }

    getUserQuery(username){
        return this.getObserver({
            queryKey: ['get_user', username],
            queryFn: () => this.doGetUser(username)
        });
    }

}

export const UserManagerContext = createContext({});

const manager = new UserManager();

export function UserManagerProvider(props){

    const queryClient = useQueryClient();

    manager.qc = queryClient;

    return (
        <UserManagerContext.Provider value={{manager: manager}}>
            {props.children}
        </UserManagerContext.Provider>
    );

}
