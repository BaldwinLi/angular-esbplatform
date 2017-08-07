import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
import { assign } from 'lodash';
// import { HttpService } from './HttpService';

@Injectable()
export class ErrorInfoService {
    constructor(private appRequest: AppRequestService) { }

    queryErrorinfo(params: any, page: string, pageSize: string): Observable<any> {
        params = assign(params, { page, page_size: pageSize });
        return this.appRequest.searchErrorinfo(params);
    }

    updateErrorinfo(params: any): Observable<any> {
        return this.appRequest.updateErrorinfo(params);
    }

    queryUsersErrorinfoList(user_id: string, page: string, pageSize: string): Observable<any> {
        return this.appRequest.queryErrorinfo("", "", "", { p: page, psize: pageSize });
    }

    queryUsersErrorinfoByErrId(err_id: string, params?: any): Observable<any> {
        return this.appRequest.queryErrorinfo(err_id, '', '', params);
    }

    queryUsersErrorinfoByTime(user_id: string, begin_ts: string, end_ts: string, page: string, pageSize: string): Observable<any> {
        return this.appRequest.queryErrorinfo("", begin_ts, end_ts, { p: page, psize: pageSize });
    }

    // queryUsersErrorinfoListAsync(page: string, pageSize: string): Observable<any>{
    //     return this.appRequest.queryAsyncErrorInfo("", "", "", { p:page, psize: pageSize });
    // }

    // queryUsersErrorinfoByErrIdAsync(err_id: string): Observable<any>{
    //     return this.appRequest.queryAsyncErrorInfo(err_id);
    // }

    // queryUsersErrorinfoByTimeAsync(begin_ts: string, end_ts: string, page: string, pageSize: string): Observable<any>{
    //     return this.appRequest.queryAsyncErrorInfo("", begin_ts, end_ts, { p:page, psize: pageSize });
    // }
}