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

  private searchFieldsConfig: any = {
    fields: ''
  };
  private persons: Array<any> = [];
  private isSuperAdmin: boolean;
  private importData: Array<Array<any>>;
  private tableConfig: any = {
    columns: [
      {
        id: 'name',
        header: "联系人姓名",
        type: 'text',
        rules: ['required']
      },
      {
        id: 'company',
        header: "公司",
        type: 'text',
      },
      {
        id: 'mobile',
        header: "联系电话",
        type: 'text',
        rules: ['required', 'pattern', 'maxLength', 'minLength'],
        maxLength: 18,
        minLength: 7,
        pattern: /^([0-9]|[\-])+$/
      },
      {
        id: 'email',
        header: "邮箱",
        type: 'text',
        rules: ['required', 'email']
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
            click: this.contacts_edit.bind(this)
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
            click: this.contacts_delete.bind(this)
          }
        }
      }
    ],
    data: this.persons,
    isStaticPagination: true
  };

  // private search(event): void {
  //   if (event && event.type == 'keypress' && event.charCode !== 13) return;
  //   this.refreshPageData();
  // }

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

  private refreshData(): void {
    let obj = this;
    this.contactSvc.querySysContact().subscribe(
      success => {
        obj.persons = success.body || [];
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  private importContacts(evt) {
    let obj = this;
    let data = {
      columns: this.tableConfig.columns.slice(0, 5),
      data: [],
      uploadCallBack: (data, invalid) => {
        if (data.length === 0) {
          window['esbLayer']({ type: 'alert', message: "上传数据不能为空！" });
          return;
        }
        if (invalid) {
          window['esbLayer']({ type: 'alert', message: "数据验证不通过！ （姓名、联系方式和邮箱不能为空！联系方式、邮箱必须格式有效。）" });
        } else {
          obj.contactSvc.createSysContact(data).subscribe(
            success => {
              obj.refreshData();
              dialog.close();
              window['esbLayer']({ type: 'alert', message: "上传成功！" })
            },
            error => window['esbLayer']({ type: 'error', message: error })
          );
        }
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
      }
    });
  }
}
