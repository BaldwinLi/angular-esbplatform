import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class ErrorStepsService {
    constructor(private appRequest: AppRequestService){}
    queryErrorflowstepsList(err_flow_id?: string): Observable<any>{
        return this.appRequest.queryErrorflowsteps("", {err_flow_id});
    }

    queryErrorflowstep(step_id: string): Observable<any>{
        return this.appRequest.queryErrorflowsteps(step_id);
    }

    createErrorflowstep(params: any): Observable<any>{
        return this.appRequest.createErrorflowsteps(params);
    }

    updateErrorflowstep(params: any): Observable<any>{
        return this.appRequest.updateErrorflowsteps(params);
    }

    deleteErrorflowstep(step_id: string): Observable<any>{
        return this.appRequest.deleteErrorflowsteps(step_id);
    }


    queryErrorstepsList(err_id: string): Observable<any>{
        return this.appRequest.queryErrorsteps(err_id);
    }

    // queryErrorstep(step_id: string): Observable<any>{
    //     return this.appRequest.queryErrorsteps(step_id);
    // }

    createErrorstep(err_id: string, params: any): Observable<any>{
        return this.appRequest.createErrorsteps(err_id, params);
    }

    updateErrorstep(err_id: string, params: any): Observable<any>{
        return this.appRequest.updateErrorsteps(err_id, params);
    }

    deleteErrorstep(step_id: string, params?: any): Observable<any>{
        return this.appRequest.deleteErrorsteps(step_id);
    }
}