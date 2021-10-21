import {from, map, mergeMap, Subject, switchMap} from "rxjs";
import {QueryObserver} from "react-query";
import {API_HOST} from "../../../config/config";

export class ApiService {

    queryClient = null;
    authContext = null;
    interceptorContext = null;

    config = {
        'api.url': API_HOST,
    };

    _getUrl(url){
        return [this.config["api.url"], url].join('/');
    }

    _fetch(url, method = 'GET', body = null){
        this.interceptorContext.setLoading(true);
        this.interceptorContext.setError(null);

        return fetch(this._getUrl(url), {
            method: method,
            headers: {...this.authContext.manager.getHeaders(),
                'accept': 'application/ld+json',
                'Content-Type': method === 'PATCH' ? 'application/merge-patch+json' : 'application/ld+json',
            },
            body: body
        }).then(response => {
            this.interceptorContext.setLoading(false);
            if (!response.ok) {
                return response.json().then(m => {
                    return Promise.reject(m);
                });
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
                    if(v.error.status === 401 && !this.authContext.manager.checkAuth()){
                        this.authContext.manager.requestLogin(v);
                    }else{
                        this.interceptorContext.setError(v.error['hydra:title']);
                    }
                } catch (e) {
                    console.log(e);
                    this.interceptorContext.setError('Error');
                }
            }
            ret.next(v);
        });
        return ret;
    }

}
