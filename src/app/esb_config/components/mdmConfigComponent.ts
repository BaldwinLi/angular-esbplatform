import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdmConfigFormDialogComponent } from './dialogComponents/MdmConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { MdmConsumersService } from '../../services/MdmConsumersService';
import { SVC_STATES, AUTH_TYPES } from '../../model/data-model';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'esb-mdm-config',
  templateUrl: 'templates/mdmConfig.html'
})
export class mdmConfigComponent {

  constructor(private route: Router, private cmm: CommonService, private mdmSvc: MdmConsumersService, private appSvc: AppRequestService) {

  }
  private searchFieldsConfig: any = {
    fields: ''
  };
  private uuid: string;
  private persons: Array<any> = [];
  private isSuperAdmin: boolean;
  private tableConfig: any = {
    columns: [
      {
        id: 'usr_svcno',
        header: "发布服务编号",
        type: 'text'
      },
      {
        id: 'user_svcname',
        header: "发布服务名称",
        type: 'text',
        width: 400
      },
      {
        id: 'sub_sys',
        header: "消费者",
        type: 'text'
      },
      {
        id: 'endpoint_cnt',
        header: "端点数",
        type: 'text'
      },
      {
        id: 'memo',
        header: "备注",
        type: 'text',
        width: 400
      },
      {
        header: "配置详细信息",
        type: 'template',
        width: '100',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            return "<i class='consumers_edits_icon'></i>"
          },
          on: {
            click: this.openCustomersWin.bind(this)
          }
        }
      }
    ],
    data: this.persons,
    isStaticPagination: true
  };

  // private search(event): void {
  //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
  //   this.refreshData(this.uuid);
  // }

  private openCustomersWin(row: any): void {
    let obj = this;
    let data = {
      consumerInfo: row
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: MdmConfigFormDialogComponent,
      title: '修改发布服务详细配置'
    });
  }

  private refreshData(): void {
    let obj = this;
    this.mdmSvc.queryPublishServices().subscribe(
      success => {
        obj.persons = success.body || [];
      },
      error => window['esbLayer']({ type: 'error', message: error })
      // error => {
      //   obj.persons = [{
      //     "usr_svcno": "S018_FOL",
      //     "user_svcname": "S018_DMAP_DealerAcc_PubService_FOL",
      //     "endpoint_cnt": 5,
      //     "memo": "FOL DealerAcc"
      //   }, {
      //     "usr_svcno": "S017_FOL",
      //     "user_svcname": "S017_DMES_DealerMasterData_FOL",
      //     "endpoint_cnt": 5,
      //     "memo": "FOL DealerMaster"
      //   }]
      // }
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
