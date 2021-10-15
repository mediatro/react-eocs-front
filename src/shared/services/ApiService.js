import {from, map, mergeMap, switchMap} from "rxjs";
import {QueryObserver} from "react-query";

export class ApiService {

    qc = null;
    config = {
        'api.url': 'https://localhost',
    };

    _getUrl(url){
        return [this.config["api.url"], url].join('/');
    }

    _fetch(url, method = 'GET', body = null){
        return fetch(this._getUrl(url), {
            method: method,
            headers: {
                'accept': 'application/ld+json',
                'Content-Type': 'application/ld+json',
            },
            body: body
        }).then(response => response.json())
    }

    getObserver(options){
        return new QueryObserver(this.qc, options);
    }

}
