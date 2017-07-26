import { Component } from '@angular/core';
import { startsWith } from 'lodash';
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
  private dataArr: Array<any> = [];
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
        id: 'svclist',
        header: "授权服务",
        type: 'array',
        displayField: "usr_svcname",
        columns: [
          {
            id: 'usr_svcno',
            header: '服务编号',
            type: 'text',
            width: '100'
          },
          {
            id: 'usr_svcname',
            header: '服务名',
            type: 'text',
            width: '300'
          }
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
      persons: row || {},
      callback: () => {
        obj.refreshData();
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
    this.refreshPageData();
    // this.refreshData(this.userId);
  }

  private getPageNow(pageNow: number) {
    this.pageNow = pageNow;
    this.refreshPageData();
  }

  private getPageTol(pageTol: number) {
    this.pageTol = pageTol;
    this.refreshPageData();
  }

  private refreshData(): void {
    let obj = this;
    // if (user_id) {
    this.userSvc.queryUsersInfo_V2().subscribe(
      success => {
        obj.dataArr = obj.persons = (success.body && success.body.map(v => {
          return {
            user_code: v.user.user_code,
            user_name: v.user.user_name,
            is_admin: v.user.is_admin,
            svclist: v.svclist
          }
        })) || [];
        obj.refreshPageData();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
    // } else {
    //   this.userSvc.queryUsersList().subscribe(
    //     success => {
    //       obj.persons = success.body || [];
    //       obj.refreshPageData();
    //     },
    //     error => window['esbLayer']({ type: 'error', message: error })
    //   );
    // }
  }

  private refreshPageData(): void {
    let obj = this;
    this.dataArr = this.persons.filter(e => {
      return !!obj.userId ? startsWith(e.user_code, obj.userId) : true;
    });
    let tableDataInfo = this.cmm.getPageData(this.dataArr || this.persons, this.pageNow, this.pageTol);
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
