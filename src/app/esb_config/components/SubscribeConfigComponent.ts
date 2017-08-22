import { Component } from '@angular/core';
import { startsWith } from 'lodash';
import { CommonService } from '../../services/common/CommonService';
import { Router } from '@angular/router';
import { SubscribeConfigDialogComponent } from './dialogComponents/SubscribeConfigDialogComponent';
import { MdmConsumersService } from '../../services/MdmConsumersService';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'esb-subscribe-config',
  templateUrl: 'templates/subscribeConfig.html'
})
export class SubscribeConfigComponent {

  constructor(private route: Router, private cmm: CommonService, private mdmSvc: MdmConsumersService, private appSvc: AppRequestService) {

  }
  private persons: Array<any> = [];
  private isSuperAdmin: boolean;
  private searchFieldsConfig: any = {
    fields: ''
  };

  private tableConfig: any = {
    columns: [
      {
        id: 'svc_no',
        header: "服务编号",
        type: 'text'
      },
      {
        id: 'svc_name',
        header: "服务名称",
        type: 'text',
        width: 600
      },
      {
        id: 'svc_type',
        header: "服务类型",
        type: 'mapping',
        options: 'SVC_TYPE'
      },
      {
        id: 'sys_cnt',
        header: "系统数",
        type: 'text',
        width: 70
      },
      {
        header: "订阅",
        type: 'template',
        width: '50',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            return "<i class='esbconfigs_edits_icon'></i>"
          },
          on: {
            click: this.openList.bind(this)
          }
        }
      }


    ],
    data: this.persons,
    isStaticPagination: true
  };

  private openList(row: any) {
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
      dialogComponent: SubscribeConfigDialogComponent,
      title: '订阅配置'
    });
  }

  // private search(event): void {
  //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
  //   // this.refreshPageData();
  // }

  private refreshData(): void {
    let obj = this;
    this.mdmSvc.querySvcConfigs().subscribe(
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
      else obj.refreshData();
    });

  }
}
