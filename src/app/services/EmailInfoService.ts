import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class EmailInfoService {
    constructor(private appRequest: AppRequestService){}
    queryEmailsList(): Observable<any>{
        return this.appRequest.queryEmails();
    }

    createEmail(params: any): Observable<any>{
        return this.appRequest.createEmail(params);
    }

    updateEmail(params: any): Observable<any>{
        return this.appRequest.updateEmail(params);
    }

    deleteEmail(cfg_id: string): Observable<any>{
        return this.appRequest.deleteEmail(cfg_id);
    }
}