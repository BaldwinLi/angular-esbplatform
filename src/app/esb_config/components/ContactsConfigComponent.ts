import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsConfigFormDialogComponent } from './dialogComponents/ContactsConfigFormDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { SysContactsService } from '../../services/SysContactsService';
import { AppRequestService } from '../../services/common/AppRequestService';

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
  private tableConfig: any = {
    columns: [],
    data: []
  };

  private search(event): void {
    if (event && event.type == 'keypress' && event.charCode !== 13) return;
    this.refreshData(this.contact_id);
  }

  private contacts_add(): void {
    let obj = this;
    let data = {
      callback: () => {
        obj.refreshData(obj.contact_id);
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
        obj.refreshData(obj.contact_id);
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
            obj.refreshData(obj.contact_id);
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

  private refreshData(contact_id?: string): void {
    let obj = this;
    if (contact_id) {
      this.contactSvc.querySysContact(contact_id).subscribe(
        success => {
          obj.persons = [success.body];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    } else {
      this.contactSvc.querySysContactsList().subscribe(
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
              id: 'contact_id',
              header: "ID",
              type: 'text'
            },
            {
              id: 'name',
              header: "联系人姓名",
              type: 'text'
            },
            {
              id: 'phone',
              header: "联系电话",
              type: 'text'
            },
            {
              id: 'email',
              header: "邮箱",
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
