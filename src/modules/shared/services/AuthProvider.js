import {createContext, useContext, useEffect, useState} from "react";
import {Subject} from "rxjs";
import jwtDecode from "jwt-decode";

export class AuthManager {

    user = null;
    userChanged$ = new Subject();
    loginRequested$ = new Subject();

    config = {
        'api.url': 'https://localhost',
    };

    getUser(){
        return this.user;
    }

    setUser(user){
        if(user !== this.user){
            this.user = user;
            this.userChanged$.next(user);
        }
    }

    login(username, password){
        const ENTRYPOINT = this.config["api.url"];

        const request = new Request(
            `${ENTRYPOINT}/authentication_token`,
            {
                method: "POST",
                body: JSON.stringify({ email: username, password }),
                headers: new Headers({ "Content-Type": "application/json" }),
            }
        );
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                this.setUser({username: username});
            });
    }

    logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        this.setUser(null);
    }

    checkAuth(){
        try {
            let token = localStorage.getItem("token");
            if(!token || new Date().getTime() / 1000 > jwtDecode(token)?.exp){
                this.logout();
                return false;
            }

            let savedUser = localStorage.getItem("username");
            if(!this.getUser() && savedUser){
                this.setUser({username: savedUser});
            }
            return true;

        } catch (e) {
            console.log(e);
        }
    }

    checkError(err){
        if ([401, 403].includes(err?.status || err?.response?.status)) {
            this.logout();
            return false;
        }
        return true;
    }

    getHeaders(){
        return localStorage.getItem("token") ? {Authorization: `Bearer ${localStorage.getItem("token")}`} : {};
    }

    requestLogin(v){
        this.loginRequested$.next(v);
    }

}


export const AuthContext = createContext({});

const manager = new AuthManager();

export function AuthProvider(props){

    const [user, setUser] = useState(null);

    manager.userChanged$.subscribe(v => setUser(v));

    return (
        <AuthContext.Provider value={{
            manager: manager,
            user: user
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

