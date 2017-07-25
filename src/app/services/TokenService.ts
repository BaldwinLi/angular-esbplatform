import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class TokenService {
    constructor(private appRequest: AppRequestService){}
    queryTokensList(params?: any): Observable<any>{
        return this.appRequest.queryTokens('', params);
    }

    queryToken(access_token: string): Observable<any>{
        return this.appRequest.queryTokens(access_token);
    }

    createToken(params: any): Observable<any>{
        return this.appRequest.createToken(params);
    }

    updateToken(params: any): Observable<any>{
        return this.appRequest.updateToken(params);
    }

    deleteToken(access_token: string): Observable<any>{
        return this.appRequest.deleteToken(access_token);
    }
}