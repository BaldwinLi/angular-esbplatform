import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailConfigFormDialogComponent } from './dialogComponents/EmailConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { EmailInfoService } from '../../services/EmailInfoService';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
    selector: 'esb-email-config',
    templateUrl: 'templates/emailConfig.html'
})
export class EmailConfigComponent {
    constructor(private route: Router, private cmm: CommonService, private emailSvc: EmailInfoService, private appSvc: AppRequestService) { }

    private searchFieldsConfig: any = {
        fields: ''
    };
    private persons: Array<any> = [];
    private isSuperAdmin: boolean;
    private tableConfig: any = {
        columns: [
            {
                id: 'cfg_id',
                header: "配置ID",
                type: 'text'
            },
            {
                id: 'to_list',
                header: "发送人",
                type: 'text'
            },
            {
                id: 'cc_list',
                header: "抄送人",
                type: 'text'
            },
            {
                id: 'memo',
                header: "备注",
                type: 'text'
            },
            {
                header: "修改",
                type: 'template',
                width: '50',
                template: {
                    type: "html",
                    tempBuilder: function (row, headers) {
                        return "<i class='esbconfigs_edits_icon'></i>"
                    },
                    on: {
                        click: this.email_edit.bind(this)
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
                        click: this.email_delete.bind(this)
                    }
                }
            }
        ],
        data: this.persons,
        isStaticPagination: true
    };

    // private search(event): void {
    //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
    //   this.refreshData(this.svc_no);
    // }

    private email_add(): void {
        let obj = this;
        let data = {
            callback: () => {
                obj.refreshData();
            }
        };
        let dialog = window['esbLayer']({
            type: 'dialog',
            data: data,
            dialogComponent: EmailConfigFormDialogComponent,
            title: '新增服务配置'
        });
    }

    private email_edit(row: any): void {
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
            dialogComponent: EmailConfigFormDialogComponent,
            title: '修改服务配置'
        });
    }

    private email_delete(row: any): void {
        let obj = this;
        let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
            () => {
                obj.emailSvc.deleteEmail(row.cfg_id).subscribe(
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
        this.emailSvc.queryEmailsList().subscribe(
            success => {
                obj.persons = success.body || [];
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
