import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { startsWith } from 'lodash';
import { Router } from '@angular/router';
import { ErrflowConfigFormDialogComponent } from './dialogComponents/ErrflowConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { ErrorFlowsService } from '../../services/ErrorFlowsService';
import { AppRequestService } from '../../services/common/AppRequestService';
import { ImportOperateDialogComponent } from '../../common/components/ImportOperateDialogComponent';

@Component({
    selector: 'err-flow-config',
    templateUrl: 'templates/errflowconfig.html'
})
export class ErrflowConfigComponent {
    constructor(private route: Router, private cmm: CommonService, private errflowSvc: ErrorFlowsService, private appSvc: AppRequestService) {

    }

    private searchFieldsConfig: any = {
        fields: ''
    };
    private persons: Array<any> = [];
    private isSuperAdmin: boolean;
    private importData: Array<Array<any>>;
    private tableConfig: any = {
        columns: [
            {
                id: 'err_flow_no',
                header: "流程名称",
                type: 'text'
            },
            {
                id: 'err_flow_desc',
                header: "流程描述",
                type: 'text',
            },
            {
                header: "修改",
                type: 'template',
                width: '50',
                template: {
                    type: "html",
                    tempBuilder: function (row, headers) {
                        return "<i class='contacts_edits_icon'></i>"
                    },
                    on: {
                        click: this.flow_edit.bind(this)
                    }
                }
            },
            {
                header: "删除",
                type: 'template',
                width: '50',
                template: {
                    type: "html",
                    tempBuilder: function (row, headers) {
                        return "<i class='delete_icon'></i>"
                    },
                    on: {
                        click: this.flow_delete.bind(this)
                    }
                }
            }
        ],
        data: this.persons,
        isStaticPagination: true
    };

    // private search(event): void {
    //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
    //   this.refreshPageData();
    // }

    private flow_add(): void {
        let obj = this;
        let data = {
            callback: () => {
                obj.refreshData();
            }
        };
        let dialog = window['esbLayer']({
            type: 'dialog',
            data: data,
            dialogComponent: ErrflowConfigFormDialogComponent,
            title: '新增建议流程'
        });
    }

    private flow_edit(row: any): void {
        let obj = this;
        let data = {
            persons: row,
            callback: () => {
                obj.refreshData();
            }
        };
        let dialog = window['esbLayer']({
            type: 'dialog',
            data: data,
            dialogComponent: ErrflowConfigFormDialogComponent,
            title: '修改建议流程'
        });
    }

    private flow_delete(row: any): void {
        let obj = this;
        let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
            () => {
                obj.errflowSvc.deleteErrorflowV2(row.err_flow_id).subscribe(
                    success => {
                        window['esbLayer']({ type: 'alert', message: "删除成功！" });
                        obj.refreshData();
                    },
                    error => window['esbLayer']({ type: 'error', message: error })
                );
                confirmLayer.close();
            }
        );
    }

    private refreshData(): void {
        let obj = this;
        this.errflowSvc.queryErrorflowV2().subscribe(
            success => {
                obj.persons = success.body || {};
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }

    ngOnInit() {
        let obj = this;
        this.appSvc.afterInitCall(() => {
            obj.isSuperAdmin = (window['currentUser'].is_admin == "3");
            if (!obj.isSuperAdmin) obj.route.navigate(['/confighome/myshare']);
            else {
                obj.refreshData();
            }
        });
    }
}
