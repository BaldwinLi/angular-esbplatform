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
        return this.appRequest.updateErrorflows(params);
    }

    deleteErrorflow(flow_id: string): Observable<any>{
        return this.appRequest.deleteErrorflows(flow_id);
    }
// Error flow tempalte service v2
    queryErrorflowV2(params?: string): Observable<any>{
        return this.appRequest.queryErrorflowsV2(params);
    }

    createErrorflowV2(params: any): Observable<any>{
        return this.appRequest.createErrorflowsV2(params);
    }

    updateErrorflowV2(params: any): Observable<any>{
        return this.appRequest.updateErrorflowsV2(params);
    }

    deleteErrorflowV2(flow_id: string): Observable<any>{
        return this.appRequest.deleteErrorflowsV2(flow_id);
    }
}