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
  private uuid: string;
  private persons: Array<any> = [];
  private rowsCount: number = 0;
  private pageNow: number = 1;
  private pageTol: number = 10;
  private isSuperAdmin: boolean;
  private tableConfig: any = {
    columns: [],
    data: []
  };

  private search(event): void {
    if (event && event.type == 'keypress' && event.charCode !== 13) return;
    this.refreshData(this.uuid);
  }

  private business_add(): void {
    let obj = this;
    let data = {
      callback: () => {
        obj.refreshData(obj.uuid);
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: MdmConfigFormDialogComponent,
      title: '新增MDM下发服务消费者配置'
    });
  }

  private business_edit(row: any): void {
    let obj = this;
    let data = {
      persons: row,
      callback: () => {
        obj.refreshData(obj.uuid);
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: MdmConfigFormDialogComponent,
      title: '修改MDM下发服务消费者配置'
    });
  }

  private business_delete(row: any): void {
    let obj = this;
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
      () => {
        obj.mdmSvc.deleteMdmConsumer(row.uuid).subscribe(
          success => {
            window['esbLayer']({ type: 'alert', message: "删除成功！" });
            obj.refreshData(obj.uuid);
          },
          error => window['esbLayer']({ type: 'error', message: error })
        );
        confirmLayer.close();
      }
    );
  }

  private getPageNow(pageNow: number): void {
    this.pageNow = pageNow;
    this.refreshPageData();
  }

  private getPageTol(pageTol: number): void {
    this.pageTol = pageTol;
    this.refreshPageData();
  }

  private refreshPageData(): void {
    let tableDataInfo = this.cmm.getPageData(this.persons, this.pageNow, this.pageTol);
    this.rowsCount = tableDataInfo.rowsCount;
    this.tableConfig.data = tableDataInfo.currentPageRows
  }

  private refreshData(uuid?: string): void {
    let obj = this;
    if (uuid) {
      this.mdmSvc.queryMdmConsumer(uuid).subscribe(
        success => {
          obj.persons = [success.body];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    } else {
      this.mdmSvc.queryMdmConsumersList().subscribe(
        success => {
          obj.persons = success.body || [];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    }
  }

  ngOnInit() {
    let obj = this;
    this.appSvc.afterInitCall(() => {
      obj.isSuperAdmin = (window['currentUser'].is_admin == "3");
      if (!obj.isSuperAdmin) obj.route.navigate(['/confighome/myshare']);
      else {
        obj.refreshData();
        obj.tableConfig = {
          columns: [
            {
              id: 'uuid',
              header: "ID",
              type: 'text'
            },
            {
              id: 'mdm_topic',
              header: "主题",
              type: 'text'
            },
            {
              id: 'consumer',
              header: "消费者",
              type: 'text'
            },
            {
              id: 'consumer_uri',
              header: "URL",
              type: 'text',
              displayField: "name"
            },
            {
              id: 'auth_type',
              header: "服务类型",
              type: 'input',
              inputType: 'select',
              options: AUTH_TYPES,
              width: '220'
            },
            {
              id: 'is_enabled',
              header: "服务状态",
              type: 'input',
              inputType: 'select',
              options: SVC_STATES,
              width: '70'
            },
            {
              id: 'svc_version',
              header: "订阅版本",
              type: 'input',
              inputType: 'text'
            },
            {
              header: "修改",
              type: 'template',
              width: '50',
              template: {
                type: "html",
                tempBuilder: function (row, headers) {
                  return "<i class='business_edits_icon'></i>"
                },
                on: {
                  click: obj.business_edit.bind(obj)
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
                  click: obj.business_delete.bind(obj)
                }
              }
            }
          ],
          data: obj.persons
        };
      }
    });

  }
}
