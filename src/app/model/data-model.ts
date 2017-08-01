import { Injectable } from '@angular/core';
import { KeyListService } from '../services/KeyListService';
import { Observable } from 'rxjs/Observable';
/**
 * 数据模型配置文件
 */
export let keylistInitialized: any;

export let SGM_ESBMON_ERRSTATUS = [];

export let SGM_ESBMON_ERRTYPE = [];

export let SGM_ESBMON_ERRLEVEL = [];

export let SGM_ESB_TRANCODE = [];

export let keylistLoaded = false;

export const SVC_STATES = [
    {
        id: '0',
        value: "禁用"
    },
    {
        id: '1',
        value: "启用"
    },
    {
        id: '2',
        value: "暂停"
    },
    {
        id: '11',
        value: '关机'
    }
];

export const IS_BOOLEAN = [
    {
        id: '0',
        value: "否"
    },
    {
        id: '1',
        value: "是"
    }
];

export const ROLE = [
    {
        id: '0',
        value: "普通用户"
    },
    {
        id: '1',
        value: "操作员"
    },
    {
        id: '2',
        value: "管理员"
    },
    {
        id: '3',
        value: "超级管理员"
    }
];

export const PATTERNS = [
    {
        id: '1',
        value: "源系统发数据到ESB"
    },
    {
        id: '2',
        value: "透传模式"
    },
    {
        id: '3',
        value: "源系统异步数据发送"
    },
    {
        id: '4',
        value: "源系统目标系统实时同步数据交换， ESB有数据格式转换"
    },
    {
        id: '5',
        value: "ESB从源系统取数据发往目标系统"
    },
    {
        id: '6',
        value: "ESB定时生成文件发往目标系统"
    },
    {
        id: '7',
        value: "1:N, 1个源，多个下游系统， ESB对下游系统返回进行组装返回"
    },
    {
        id: '8',
        value: "数据下发模式"
    }
];

export const IS_ENABLE = [
    {
        id: '0',
        value: "禁用"
    },
    {
        id: '1',
        value: "启用"
    }
];

export const EVENT_LEVELS = [
    {
        id: '0',
        value: "可忽略"
    },
    {
        id: '1',
        value: "一般"
    },
    {
        id: '2',
        value: "警告"
    },
    {
        id: '3',
        value: "严重"
    },
    {
        id: '4',
        value: "紧急"
    }
    // {
    //     id: '5',
    //     value: "致命"
    // }
];

export const AUTH_TYPES = [
    {
        id: '0',
        value: "没有认证方式"
    },
    {
        id: '1',
        value: "http_basic（user_agent辅助使用）"
    },
    {
        id: '2',
        value: "oauth_token"
    }
];

export const CONTACT_TYPE = [
    {
        id: '1',
        value: '主要联系人'
    },
    {
        id: '2',
        value: '次要联系人'
    }
];

export const RES_TYPE = [
    {
        id: 'error',
        value: '错误页面'
    },
    {
        id: 'tran',
        value: '交易页面'
    },
    {
        id: 'errorovw',
        value: '监控页面'
    }
];

export const RES_TYPES = {
  error: 'servicedetail',
  tran: 'transactiondetail',
  errorovw: 'errormonitor'
};

@Injectable()
export class DataModelService {
    constructor(private klSvc: KeyListService) {

    }


    init(): any {
        let obj = this;
        keylistInitialized = this.klSvc.queryKeyList();
        keylistInitialized.subscribe(
            success => {
                obj.buildDataModel(success.body);
                keylistLoaded = true;
            },
            error => {
                window['esbLayer']({ type: 'error', message: error });
            });
    }

    private buildDataModel(data): void {
        data && data.forEach(e => {
            if (e.viewtable == "SGM_ESBMON_ERRSTATUS")
                SGM_ESBMON_ERRSTATUS.push({
                    id: e.v_code,
                    value: e.v_desc
                });
            else if (e.viewtable == "SGM_ESBMON_ERRTYPE")
                SGM_ESBMON_ERRTYPE.push({
                    id: e.v_code,
                    value: e.v_desc
                });
            else if (e.viewtable == "SGM_ESBMON_ERRLEVEL")
                SGM_ESBMON_ERRLEVEL.push({
                    id: e.v_code,
                    value: e.v_desc
                });
            else if (e.viewtable == "SGM_ESB_TRANCODE")
                SGM_ESB_TRANCODE.push({
                    id: e.v_code,
                    value: e.v_desc
                });
        });
    }

}
