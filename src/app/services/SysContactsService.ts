import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class SysContactsService {
    constructor(private appRequest: AppRequestService){}
    querySysContactsList(): Observable<any>{
        return this.appRequest.querySyscontacts();
    }

    querySysContact(params?: any): Observable<any>{
        return this.appRequest.querySyscontacts(params);
    }

    createSysContact(params: any): Observable<any>{
        return this.appRequest.createSyscontacts(params);
    }

    updateSysContact(params: any): Observable<any>{
        return this.appRequest.updateSyscontacts(params);
    }

    deleteSysContact(contact_id: string): Observable<any>{
        return this.appRequest.deleteSyscontacts(contact_id);
    }

    querySystemsAndContactsList(sys_name_list?: Array<string>): Observable<any>{
        return this.appRequest.querySystemsAndContactsList(sys_name_list);
    }
}