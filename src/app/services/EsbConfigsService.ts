import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class EsbConfigsService {
    constructor(private appRequest: AppRequestService){}
    queryEsbConfigInfoList(): Observable<any>{
        return this.appRequest.queryEsbconfigs();
    }

    queryEsbConfigInfo(svc_no: string): Observable<any>{
        return this.appRequest.queryEsbconfigs(svc_no);
    }

    createEsbConfig(params: any): Observable<any>{
        return this.appRequest.createEsbconfigs(params);
    }

    updateEsbConfig(params: any): Observable<any>{
        return this.appRequest.updateEsbconfigs(params);
    }

    deleteEsbConfig(svc_no: string): Observable<any>{
        return this.appRequest.deleteEsbconfigs(svc_no);
    }

    retrieveSvcNewNo(type: string): Observable<any>{
        return this.appRequest.retrieveSvcNewNo(type);
    }
}