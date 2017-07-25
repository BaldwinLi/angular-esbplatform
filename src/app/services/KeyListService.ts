import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';

@Injectable()
export class KeyListService {
    constructor(private appRequest: AppRequestService){}
    queryKeyList(): Observable<any>{
        return this.appRequest.queryKeylist();
    }
}