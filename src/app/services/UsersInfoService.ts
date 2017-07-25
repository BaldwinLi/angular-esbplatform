import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppRequestService } from './common/AppRequestService';
// import { HttpService } from './HttpService';
@Injectable()
export class UsersInfoService {
    constructor(private appRequest: AppRequestService) { }
    queryUsersList(): Observable<any> {
        return this.appRequest.queryUsers();
    }

    queryUser(user_id: string): Observable<any> {
        return this.appRequest.queryUsers(user_id);
    }

    updateUser(params: any): Observable<any> {
        return this.appRequest.updateUsers(params);
    }

    queryUserOverView(user_id?: string): Observable<any> {
        return this.appRequest.queryOverView(user_id);
    };

    queryUsersServices(user_id?: string):  Observable<any> {
        return this.appRequest.queryUsersServices(user_id);
    };
    // queryUserOverViewAsync(user_id?: string): Observable<any>{
    //     return this.appRequest.queryAsyncOverview();
    // }
}