import {from, map, mergeMap, Subject, switchMap} from "rxjs";
import {QueryObserver} from "react-query";
import {API_HOST} from "../../../config/config";

export class ApiService {

    queryClient = null;
    authContext = null;

    config = {
        'api.url': API_HOST,
    };

    _getUrl(url){
        return [this.config["api.url"], url].join('/');
    }

    _fetch(url, method = 'GET', body = null){
        return fetch(this._getUrl(url), {
            method: method,
            headers: {...this.authContext.manager.getHeaders(),
                'accept': 'application/ld+json',
                'Content-Type': method === 'PATCH' ? 'application/merge-patch+json' : 'application/ld+json',
            },
            body: body
        }).then(response => {
            if (!response.ok) {
                return response.json().then(m => {
                    throw new Error(JSON.stringify(m));
                })
            }
            return response.json();
        })
    }

    getObserver$(options){
        let ret = new Subject();
        let qo = new QueryObserver(this.queryClient, options);

        qo.subscribe(v => {
            if(v.isError){
                try {
                    let r = JSON.parse(v.error.message);
                    if(r.code == 401 && !this.authContext.manager.checkAuth()){
                        this.authContext.manager.requestLogin(v);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            ret.next(v);
        });
        return ret;
    }

}
