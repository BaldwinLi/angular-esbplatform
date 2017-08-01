import { Injectable } from '@angular/core';
import { trim } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { userInitialized } from '../../homeComponent';
import { keylistInitialized, keylistLoaded } from '../../model/data-model';
import { HttpService } from './HttpService';

export const isLocal = (window.location.hostname == "localhost" || window.location.hostname == "127.0.0.1");
export const loginUser = (()=>(isLocal ? 'apptest05' : (window['currentUser'].user_code || '')));
const userInfoHeader = (()=>(isLocal ? { 'iv-user': loginUser() } : undefined));

export const appContextPath = (function () {
    if (isLocal) {
        return window.location.origin + "/dev/";
    } else {
        return window.location.origin + window.location.pathname + "api/";
    }
})();

// const localOverviewContextPath = (function () {
//     return window.location.origin + "/dev_api/";
// })();

@Injectable()
export class AppRequestService {
    constructor(private httpService: HttpService) { }

    afterInitCall(callBackFunc: any): Observable<any> {
        if (keylistLoaded && !!window['currentUser']) {
            callBackFunc();
            return;
        }
        return userInitialized.subscribe({
            complete: () => {
                keylistInitialized.subscribe({
                    complete: () => {
                        callBackFunc();
                    }
                });
            }
        });
    }

    resendTranlog(
        // svc_id: string, 
        // tran_uuid: string, 
        // params?: any
        paramArray: Array<any>,
        type?: string
    ): Observable<any> {

        return this.httpService.getRequestObservable(
            // `${appContextPath}tranlog_replay/v1/${svc_id}/tran_uuid/${tran_uuid}`,
            type == 'ignore' ? `${appContextPath}tranlog_replay/v2/ignore` : `${appContextPath}tranlog_replay/v2`,
            // "get", 
            'post',
            // params || {}
            paramArray || [],
            userInfoHeader()
        );
    }

    userLogin(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}users_login`, "get", params || {}, userInfoHeader());
    }

    queryKeylist(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}keylist`, "get", params || {});
    }

    queryUsers(user_id?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(user_id ? `${appContextPath}users/${user_id}` : `${appContextPath}users`, "get", params || {});
    }

    queryUsers_V2(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}users_v2`, "get", params || {}, userInfoHeader());
    }

    updateUsers(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}users`, "put", params || {});
    }

    updateUsers_V2(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}users_v2`, "put", params || {}, userInfoHeader());
    }

    deleteUser(user_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}users_v2/${user_id}`, "delete", params || {}, userInfoHeader());
    }

    queryOverView(user_id: string): Observable<any> {
        return this.httpService.getRequestObservable(
            `${appContextPath}users_overview`,
            "get",
            {},
            { 'iv-user': isLocal ? window['currentUser'].user_code : user_id });
    }

    queryUsersServices(user_id?: string): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}svclist${user_id ? ('/' + user_id) : ''}`, "get", {}, userInfoHeader());
    }

    queryEsbconfigs(svc_no?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(svc_no ? `${appContextPath}esbconfigs/${svc_no}` : `${appContextPath}esbconfigs`, "get", params || {});
    }

    createEsbconfigs(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}esbconfigs`, "post", params || {});
    }

    updateEsbconfigs(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}esbconfigs`, "put", params || {});
    }

    deleteEsbconfigs(svc_no: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}esbconfigs/${svc_no}`, "delete", params || {});
    }

    queryMdmconsumers(uuid?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(uuid ? `${appContextPath}mdm_consumers/${uuid}` : `${appContextPath}mdm_consumers`, "get", params || {});
    }

    createMdmconsumers(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}mdm_consumers`, "post", params || {});
    }

    updateMdmconsumers(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}mdm_consumers`, "put", params || {});
    }

    deleteMdmconsumers(uuid: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}mdm_consumers/${uuid}`, "delete", params || {});
    }

    querySystems(sys_no?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(sys_no ? `${appContextPath}systems/${sys_no}` : `${appContextPath}systems`, "get", params || {});
    }

    createSystems(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}systems`, "post", params || {});
    }

    updateSystems(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}systems`, "put", params || {});
    }

    deleteSystems(sys_no: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}systems/${sys_no}`, "delete", params || {});
    }

    querySystemsMulti(sys_no_list: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(sys_no_list ? `${appContextPath}systems/${sys_no_list}` : `${appContextPath}systems`, "get", params || {});
    }

    querySystemsAndContactsList(sys_name_list: Array<string>): Observable<any> {
        let sysnamelist = '';
        sys_name_list.forEach(e => {
            if (!!e) sysnamelist += e + ',';
        });
        sysnamelist = trim(sysnamelist, ',');
        return this.httpService.getRequestObservable(`${appContextPath}system_search/${sysnamelist}`, "get", {});
    }

    querySyscontacts(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}contacts_v2`, "get", params || {});
    }

    createSyscontacts(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}contacts_v2`, "post", params || {});
    }

    updateSyscontacts(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}contacts_v2`, "put", params || {});
    }

    deleteSyscontacts(contact_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}contacts_v2/${contact_id}`, "delete", params || {});
    }

    queryCaches(key?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(key ? `${appContextPath}caches/${key}` : `${appContextPath}caches`, "get", params || {});
    }

    createCaches(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}caches`, "post", params || {});
    }

    updateCaches(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}caches`, "put", params || {});
    }

    deleteCaches(key: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}caches/${key}`, "delete", params || {});
    }

    queryErrorflows(flow_id?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(flow_id ? `${appContextPath}error_flows/${flow_id}` : `${appContextPath}error_flows`, "get", params || {});
    }

    createErrorflows(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}error_flows`, "post", params || {});
    }

    updateErrorflows(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}error_flows`, "put", params || {});
    }

    deleteErrorflows(flow_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}error_flows/${flow_id}`, "delete", params || {});
    }

    updateErrorinfo(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}error_info`, "put", params || {});
    }

    searchErrorinfo(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(
            // `${appContextPath}error_info/search`,
            `${appContextPath}error_search`,
            "post", params || {});
    }

    queryErrorinfo(err_id?: string, begin_ts?: string, end_ts?: string, params?: any): Observable<any> {
        let params_str = ""
        if (err_id) {
            params_str = `/${err_id}`;
            params = {}
        } else if (begin_ts && end_ts) {
            params_str = `/${begin_ts}/${end_ts}`;
        }
        return this.httpService.getRequestObservable(`${appContextPath}error_byid${params_str}`, "get", params || {}, userInfoHeader());
    }

    queryErrorflowsteps(step_id?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(step_id ? `${appContextPath}errflow/error_steps/${step_id}` : `${appContextPath}errflow/error_steps`, "get", params || {});
    }

    createErrorflowsteps(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errflow/error_steps`, "post", params || {});
    }

    updateErrorflowsteps(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errflow/error_steps`, "put", params || {});
    }

    deleteErrorflowsteps(step_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errflow/error_steps/${step_id}`, "delete", params || {});
    }

    queryErrorsteps(error_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errorlog_v2/error_steps/${error_id}`, "get", params || {});
    }

    createErrorsteps(error_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errorlog_v2/error_steps/${error_id}`, "post", params || {});
    }

    updateErrorsteps(error_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errorlog_v2/error_steps/${error_id}`, "put", params || {});
    }

    deleteErrorsteps(step_id: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}errorlog_v2/error_steps/errlog/${step_id}`, "delete", params || {});
    }

    queryTranlog(uuid?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(uuid ? `${appContextPath}tran_log/${uuid}` : `${appContextPath}tran_log`, "get", params || {});
    }

    queryTranlogV2(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}tran_log/v2`, "get", params || {});
    }

    queryTranlogbyUuid(uuid: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}tranlog_byuuid/${uuid}`, "get", params || {}, userInfoHeader());
    }

    queryTokens(access_token?: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}tokens` + (access_token ? `/${access_token}` : ''), "get", params || {}, userInfoHeader());
    }

    createToken(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}tokens`, "post", params || {}, userInfoHeader());
    }

    updateToken(params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}tokens`, "put", params || {});
    }

    deleteToken(access_token: string, params?: any): Observable<any> {
        return this.httpService.getRequestObservable(`${appContextPath}tokens/${access_token}`, "delete", params || {});
    }
}