import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class SystemsService {
    constructor(private appRequest: AppRequestService){}
    // querySystemsList(): Observable<any>{
    //     return this.appRequest.querySystems();
    // }

    // querySystem(sys_no: string): Observable<any>{
    //     return this.appRequest.querySystems(sys_no);
    // }

    createSystem(params: any): Observable<any>{
        return this.appRequest.createSystems(params);
    }

    updateSystem(params: any): Observable<any>{
        return this.appRequest.updateSystems(params);
    }

    // deleteSystem(sys_no: string): Observable<any>{
    //     return this.appRequest.deleteSystems(sys_no);
    // }

    // queryMultiSystemsList(sys_no_list: string): Observable<any>{
    //     return this.appRequest.querySystemsMulti(sys_no_list);
    // }
}