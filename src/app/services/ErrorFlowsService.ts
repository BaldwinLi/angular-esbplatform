import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class ErrorFlowsService {
    constructor(private appRequest: AppRequestService){}
    queryErrorflowsList(): Observable<any>{
        return this.appRequest.queryErrorflows();
    }

    queryErrorflow(flow_id: string): Observable<any>{
        return this.appRequest.queryErrorflows(flow_id);
    }

    createErrorflow(params: any): Observable<any>{
        return this.appRequest.createErrorflows(params);
    }

    updateErrorflow(params: any): Observable<any>{
        return this.appRequest.updateCaches(params);
    }

    deleteErrorflow(flow_id: string): Observable<any>{
        return this.appRequest.deleteErrorflows(flow_id);
    }
}