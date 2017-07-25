import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
import { assign } from 'lodash';
// import { HttpService } from './HttpService';

@Injectable()
export class TranLogService {
    constructor(private appRequest: AppRequestService){}
    // queryTranlogList(page: string, pageSize: string, params?: any): Observable<any>{
    //     if(!params) params = {};
    //     params = assign(params, {p: page, psize: pageSize});
    //     return this.appRequest.queryTranlog("", params);
    // }

    // queryTranlog(tran_uuid: string): Observable<any>{
    //     return this.appRequest.queryTranlog(tran_uuid);
    // }

    queryTranlogList(page: string, pageSize: string, params?: any): Observable<any>{
        if(!params) params = {};
        params = assign(params, {p: page, psize: pageSize});
        return this.appRequest.queryTranlogV2(params);
    }

    queryTranlog(tran_uuid: string): Observable<any>{
        let params = {
            tranuuid: tran_uuid
        };
        return this.appRequest.queryTranlogV2(params);
    }

    queryTranlogbyUuid(tran_uuid: string){
        return this.appRequest.queryTranlogbyUuid(tran_uuid);
    }
}