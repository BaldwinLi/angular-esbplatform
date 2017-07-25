import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceConfigFormDialogComponent } from './dialogComponents/ServiceConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { EsbConfigsService } from '../../services/EsbConfigsService';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'esb-service-config',
  templateUrl: 'templates/serviceConfig.html'
})
export class serviceConfigComponent {
  constructor(private route: Router, private cmm: CommonService, private configSvc: EsbConfigsService, private appSvc: AppRequestService) { }

  private svc_no: string;
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
    this.refreshData(this.svc_no);
  }

  private esbconfigs_add(): void {
    let obj = this;
    let data = {
      callback: () => {
        obj.refreshData(obj.svc_no);
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ServiceConfigFormDialogComponent,
      title: '新增服务配置'
    });
  }

  private esbconfigs_edit(row: any): void {
    let obj = this;
    let data = {
      persons: row,
      callback: () => {
        obj.refreshData(obj.svc_no);
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ServiceConfigFormDialogComponent,
      title: '修改服务配置'
    });
  }

  private esbconfigs_delete(row: any): void {
    let obj = this;
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
      () => {
        obj.configSvc.deleteEsbConfig(row.uuid).subscribe(
          success => {
            window['esbLayer']({ type: 'alert', message: "删除成功！" });
            obj.refreshData(obj.svc_no);
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

  private refreshData(svc_no?: string): void {
    let obj = this;
    if (svc_no) {
      this.configSvc.queryEsbConfigInfo(svc_no).subscribe(
        success => {
          obj.persons = [success.body||{}];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    } else {
      this.configSvc.queryEsbConfigInfoList().subscribe(
        success => {
          obj.persons = success.body||[];
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
              id: 'svc_no',
              header: "服务编号",
              type: 'text'
            },
            {
              id: 'svc_name',
              header: "服务名",
              type: 'text'
            },
            {
              id: 'svc_id',
              header: "服务ID",
              type: 'text'
            },
            {
              id: 'project_name',
              header: "项目名称",
              type: 'text'
            },
            {
              id: 'svc_state',
              header: "服务状态",
              type: 'mapping',
              options: 'SVC_STATES'
            },
            {
              id: 'svc_desc',
              header: "项目描述",
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
                  click: obj.esbconfigs_edit.bind(obj)
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
                  click: obj.esbconfigs_delete.bind(obj)
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
