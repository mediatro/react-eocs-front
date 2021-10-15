import {createContext, useContext, useEffect, useState} from "react";
import {Subject} from "rxjs";
import {UserManagerContext} from "../../eocs/auth/services/UserManagerProvider";

export class AuthManager {

    um = null;

    user = null;
    userChanged$ = new Subject();


    getUser(){
        return this.user;
    }

    setUser(user){
        this.user = user;
        this.userChanged$.next(user);
    }

    isVerified(){
        return this.getUser();
    }

    login(username, password){
        this.um.getUserQuery(username).subscribe((v) => {
            if(v.data && v.data['hydra:totalItems'] > 0){
                this.setUser(v.data['hydra:member'][0]);
            }
        })
    }

    logout(){
        this.setUser(null);
    }

}


export const AuthContext = createContext({});

const manager = new AuthManager();

export function AuthProvider(props){

    const umc = useContext(UserManagerContext);
    const [user, setUser] = useState(null);

    manager.um = umc.manager;
    manager.userChanged$.subscribe(v => setUser(v));

    return (
        <AuthContext.Provider value={{manager: manager, user: user}}>
            {props.children}
        </AuthContext.Provider>
    );
}

