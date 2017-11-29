import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class CachesService {
    constructor(private appRequest: AppRequestService) { }
    queryCachesList(): Observable<any> {
        return this.appRequest.queryCaches();
    }

    queryCache(key: string): Observable<any> {
        return this.appRequest.queryCaches(key);
    }

    createCache(params: any): Observable<any> {
        return this.appRequest.createCaches(params);
    }

    updateCache(params: any): Observable<any> {
        return this.appRequest.updateCaches(params);
    }

    deleteCache(key: string): Observable<any> {
        return this.appRequest.deleteCaches(key);
    }
}
