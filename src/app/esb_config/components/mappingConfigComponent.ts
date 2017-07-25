import { Component } from '@angular/core';
import { CommonService } from '../../services/common/CommonService';
import { Router } from '@angular/router';
import { MappingConfigDialogComponent } from './dialogComponents/MappingConfigDialogComponent';
import { UsersInfoService } from '../../services/UsersInfoService';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'esb-mapping-config',
  templateUrl: 'templates/mappingConfig.html'
})
export class mappingConfigComponent {

  constructor(private route: Router, private cmm: CommonService, private userSvc: UsersInfoService, private appSvc: AppRequestService) {

  }
  private persons: Array<any> = [];

  private userId: string;
  private rowsCount: number = 0;
  private pageNow: number = 1;
  private pageTol: number = 10;
  private isSuperAdmin: boolean;

  private tableConfig: any = {
    columns: [
      {
        id: 'user_code',
        header: "用户名",
        type: 'text'
      },
      {
        id: 'user_name',
        header: "姓名",
        type: 'text'
      },
      {
        id: 'is_admin',
        header: "角色",
        type: 'mapping',
        options: 'ROLE'
      },
      {
        id: 'services',
        header: "授权服务",
        type: 'array',
        displayField: "svc_name",
        columns: [
          {
            id: 'svc_no',
            header: '服务编号',
            type: 'text'
          },
          {
            id: 'svc_name',
            header: '服务名',
            type: 'text'
          },
        ]
      },
      {
        header: "操作",
        type: 'template',
        width: '50',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            return "<i class='esbconfigs_edits_icon'></i>"
          },
          on: {
            click: this.openServerList.bind(this)
          }
        }
      }
    ],
    data: this.persons
  };

  private openServerList(row: any) {
    let obj = this;
    let data = {
      persons: row.services || [],
      callback: () => {
        obj.refreshData(obj.userId);
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: MappingConfigDialogComponent,
      title: '授权服务'
    });
  }

  private search(event): void {
    if (event && event.type == 'keypress' && event.charCode !== 13) return;
    this.refreshData(this.userId);
  }

  private getPageNow(pageNow: number) {
    this.pageNow = pageNow;
    this.refreshPageData();
  }

  private getPageTol(pageTol: number) {
    this.pageTol = pageTol;
    this.refreshPageData();
  }

  private refreshData(user_id?: string): void {
    let obj = this;
    if (user_id) {
      this.userSvc.queryUser(user_id).subscribe(
        success => {
          obj.persons = [success.body];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    } else {
      this.userSvc.queryUsersList().subscribe(
        success => {
          obj.persons = success.body || [];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    }
  }

  private refreshPageData(): void {
    let tableDataInfo = this.cmm.getPageData(this.persons, this.pageNow, this.pageTol);
    this.rowsCount = tableDataInfo.rowsCount;
    this.tableConfig.data = tableDataInfo.currentPageRows
  }

  ngOnInit() {
    let obj = this;
    this.appSvc.afterInitCall(() => {
      obj.isSuperAdmin = (window['currentUser'].is_admin == "3");
      if (!obj.isSuperAdmin) obj.route.navigate(['/confighome/myshare']);
      else obj.refreshData();
    });

  }
}
