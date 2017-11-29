import { Component } from '@angular/core';
import { startsWith } from 'lodash';
import { Router } from '@angular/router';
import { SystemConfigFormDialogComponent } from './dialogComponents/SystemConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
// import { SystemsService } from '../../services/SystemsService';
import { SysContactsService } from '../../services/SysContactsService';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'esb-system-config',
  templateUrl: 'templates/systemConfig.html'
})
export class systemConfigComponent {
  constructor(private route: Router, private cmm: CommonService, private sysContactSvc: SysContactsService, private appSvc: AppRequestService) {

  }

  private searchFieldsConfig: any = {
    fields: ''
  };
  private persons: Array<any> = [];
  private isSuperAdmin: boolean;
  private tableConfig: any = {
    columns: [
      {
        id: 'sys_no',
        header: "系统代码",
        type: 'text'
      },
      {
        id: 'sys_name',
        header: "系统简称",
        type: 'text'
      },
      {
        id: 'full_name',
        header: "系统描述",
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
            return "<i class='consumers_edits_icon'></i>"
          },
          on: {
            click: this.consumers_edit.bind(this)
          }
        }
      }
    ],
    data: this.persons,
    isStaticPagination: true
  };

  // private search(event): void {
  //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
  //   // this.refreshPageData();
  // }

  private consumers_add(): void {
    let obj = this;
    let data = {
      callback: () => {
        obj.refreshData();
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: SystemConfigFormDialogComponent,
      title: '新增系统表'
    });
  }

  private consumers_edit(row: any): void {
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
      dialogComponent: SystemConfigFormDialogComponent,
      title: '修改系统表'
    });
  }

  private refreshData(): void {
    let obj = this;
    this.sysContactSvc.querySystemsAndContactsList().subscribe(
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
