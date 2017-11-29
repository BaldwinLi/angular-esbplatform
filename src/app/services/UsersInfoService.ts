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

    UserLogin(): Observable<any> {
        return this.appRequest.userLogin();
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

    queryUsersInfo_V2(): Observable<any> {
        return this.appRequest.queryUsers_V2();
    }

    updateUsersInfo_V2(params: any): Observable<any> {
        return this.appRequest.updateUsers_V2(params);
    }

    deleteUser(user_id: string): Observable<any> {
        return this.appRequest.deleteUser(user_id);
    }
    // queryUserOverViewAsync(user_id?: string): Observable<any>{
    //     return this.appRequest.queryAsyncOverview();
    // }
}