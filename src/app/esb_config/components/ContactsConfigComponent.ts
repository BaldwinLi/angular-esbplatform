import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { startsWith } from 'lodash';
import { Router } from '@angular/router';
import { ContactsConfigFormDialogComponent } from './dialogComponents/ContactsConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { SysContactsService } from '../../services/SysContactsService';
import { AppRequestService } from '../../services/common/AppRequestService';
import { ImportOperateDialogComponent } from '../../common/components/ImportOperateDialogComponent';

@Component({
  selector: 'esb-system-config',
  templateUrl: 'templates/contactsConfig.html'
})
export class ContactsConfigComponent {
  constructor(private route: Router, private cmm: CommonService, private contactSvc: SysContactsService, private appSvc: AppRequestService) {

  }

  private contact_id: string;
  private persons: Array<any> = [];
  private rowsCount: number = 0;
  private pageNow: number = 1;
  private pageTol: number = 10;
  private isSuperAdmin: boolean;
  private dataArr: Array<any> = [];
  private importData: Array<Array<any>>;
  private tableConfig: any = {
    columns: [],
    data: []
  };

  private search(event): void {
    if (event && event.type == 'keypress' && event.charCode !== 13) return;
    this.refreshPageData();
  }

  private contacts_add(): void {
    let obj = this;
    let data = {
      callback: () => {
        obj.refreshData();
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ContactsConfigFormDialogComponent,
      title: '新增系统联系人'
    });
  }

  private contacts_edit(row: any): void {
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
      dialogComponent: ContactsConfigFormDialogComponent,
      title: '修改系统联系人'
    });
  }

  private contacts_delete(row: any): void {
    let obj = this;
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
      () => {
        obj.contactSvc.deleteSysContact(row.contact_id).subscribe(
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

  private getPageNow(pageNow: number): void {
    this.pageNow = pageNow;
    this.refreshPageData();
  }

  private getPageTol(pageTol: number): void {
    this.pageTol = pageTol;
    this.refreshPageData();
  }

  private refreshData(): void {
    let obj = this;
    this.contactSvc.querySysContact().subscribe(
      success => {
        obj.persons = success.body || [];
        obj.refreshPageData();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  private refreshPageData(): void {
    let obj = this;
    this.dataArr = this.persons.filter(e => {
      return !!obj.contact_id ? (startsWith(e.name, obj.contact_id) || startsWith(e.email, obj.contact_id)) : true;
    });
    let tableDataInfo = this.cmm.getPageData(this.dataArr || this.persons, this.pageNow, this.pageTol);
    this.rowsCount = tableDataInfo.rowsCount;
    this.tableConfig.data = tableDataInfo.currentPageRows
  }

  private importContacts(evt) {
    let obj = this;
    let data = {
      columns: this.tableConfig.columns.slice(0, 5),
      data: [],
      uploadCallBack: (data) => {
        if (data.length === 0) {
          window['esbLayer']({ type: 'alert', message: "上传数据不能为空！" });
          return;
        }
          const isValid = data.every(e => {
            return (!!e.name &&
              !!e.mobile &&
              !!e.email &&
              /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.email) &&
              /^([0-9]|[\-])+$/.test(e.mobile) &&
              e.mobile.length > 6 &&
              e.mobile.length < 19
            );
          });
        if (isValid) {
          obj.refreshData();
          dialog.close();
        } else window['esbLayer']({ type: 'alert', message: "数据验证不通过！ （姓名、联系方式和邮箱不能为空！联系方式、邮箱必须格式有效。）" });
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ImportOperateDialogComponent,
      title: '批量导入联系人列表'
    });
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
            // {
            //   id: 'contact_id',
            //   header: "ID",
            //   type: 'text'
            // },
            {
              id: 'name',
              header: "联系人姓名",
              type: 'text'
            },
            {
              id: 'company',
              header: "公司",
              type: 'text',
            },
            {
              id: 'mobile',
              header: "联系电话",
              type: 'text'
            },
            {
              id: 'email',
              header: "邮箱",
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
                  return "<i class='contacts_edits_icon'></i>"
                },
                on: {
                  click: obj.contacts_edit.bind(obj)
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
                  click: obj.contacts_delete.bind(obj)
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
