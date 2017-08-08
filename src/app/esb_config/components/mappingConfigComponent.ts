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
  private isSuperAdmin: boolean;
  private searchFieldsConfig: any = {
    fields: ''
  };

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
        id: 'memo',
        header: "用户描述",
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
            click: this.openServerList.bind(this)
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
            click: this.user_delete.bind(this)
          }
        }
      }


    ],
    data: this.persons,
    isStaticPagination: true
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

  private user_delete(row: any): void {
    let obj = this;
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
      () => {
        obj.userSvc.deleteUser(row.user_code).subscribe(
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

  // private search(event): void {
  //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
  //   // this.refreshPageData();
  // }

  private refreshData(): void {
    let obj = this;
    this.userSvc.queryUsersInfo_V2().subscribe(
      success => {
        obj.persons = (success.body && success.body.map(v => {
          return {
            user_code: v.user.user_code,
            user_name: v.user.user_name,
            is_admin: v.user.is_admin,
            memo: v.user.memo,
            svclist: v.svclist
          }
        })) || [];
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
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
