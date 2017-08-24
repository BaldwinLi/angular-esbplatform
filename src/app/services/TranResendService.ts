import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class TranResendService {
    constructor(private appRequest: AppRequestService){}
    // resend(svc_id: string, tran_uuid: string): Observable<any>{
    //     return this.appRequest.resendTranlog(svc_id, tran_uuid);
    // }

    resend(trans: Array<any>, type?: string): Observable<any>{
        return this.appRequest.resendTranlog(trans, type);
    }

    queryResendSessionHistory(svc_no?: string): Observable<any>{
        return this.appRequest.querySession(svc_no);
    }
}