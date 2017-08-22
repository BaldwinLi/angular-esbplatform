import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class MdmConsumersService {
    constructor(private appRequest: AppRequestService){}
    queryMdmConsumersList(): Observable<any>{
        return this.appRequest.queryMdmconsumers();
    }

    queryMdmConsumer(uuid: string): Observable<any>{
        return this.appRequest.queryMdmconsumers(uuid);
    }

    createMdmConsumer(params: any): Observable<any>{
        return this.appRequest.createMdmconsumers(params);
    }

    updateMdmConsumer(params: any): Observable<any>{
        return this.appRequest.updateMdmconsumers(params);
    }

    deleteMdmConsumer(uuid: string): Observable<any>{
        return this.appRequest.deleteMdmconsumers(uuid);
    }

    querySvcConfigs(param?: any): Observable<any>{
        return this.appRequest.querySvcConfigs(param);
    }

    querySvcListConfig(svc_no: string, param?: any): Observable<any>{
        return this.appRequest.querySvcListConfig(svc_no, param);
    }

    updateSvcListConfig(svc_no: string, param: any): Observable<any>{
        return this.appRequest.updateSvcListConfig(svc_no, param);
    }
}