import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { CommonService } from '../../services/common/CommonService';
import { ErrorInfoService } from '../../services/ErrorInfoService';
import { EsbConfigsService } from '../../services/EsbConfigsService';
import { TranLogService } from '../../services/TranLogService';
import { TranResendService } from '../../services/TranResendService';
import { SysContactsService } from '../../services/SysContactsService';
import { AppRequestService } from '../../services/common/AppRequestService';
import { ErrorStepsService } from '../../services/ErrorStepsService';
import { ErrorFlowDialogComponent } from './dialogComponents/ErrorFlowDialogComponent';
import { ServicesListSharingDialogComponent } from './dialogComponents/ServicesListSharingDialogComponent';


@Component({
  selector: 'esb-services-detail',
  templateUrl: 'templates/serviceDetail.html'
})
export class serviceDetailComponent {
  // private err_reason: string;
  private data2: any = {};
  private hasReplayEntry: boolean = false;
  private resendable: boolean = false;
  // private service1: any = {};
  // private err_data: Array<any> = [];
  private src: any = { contacts: [] };
  private dest: any = { contacts: [] };
  private data3: Array<any> = [];
  private err_data4: Array<any> = [];
  private tokens: Array<any> = [];
  // private err_step_no: string = "";
  // private err_step_name: string = "";
  // private err_no: string = "";
  // private err_name: string = "";
  // private err_ststu: string = "";
  // private err_desc: string = "";
  private errorflows: Array<any>;
  private tableConfig: any = {
    columns: [
      {
        id: 'tran_code',
        header: "交易代码",
        type: 'text'
      },
      {
        id: 'tran_uuid',
        header: "交易UUID",
        type: 'text'
      },
      {
        id: 'tran_ts',
        header: "时间",
        type: 'date',
        format: 'toTime'
      },
      {
        id: 'tran_status',
        header: "状态",
        type: 'mapping',
        options: 'SGM_ESBMON_ERRSTATUS'
      },
      {
        header: "详细信息",
        type: 'template',
        class: 'mess',
        template: {
          type: "link",
          context: function (row, headers) {
            return "查看";
          },
          link: function (row, headers) {
            return row.log_url;
          },
          target: "_blank"
        }
      }
    ],
    data: this.data3
  };

  private srcContactTableConfig: any = {
    columns: [
      {
        id: 'id',
        header: "联系人ID",
        type: 'text'
      },
      {
        id: 'name',
        header: "姓名",
        type: 'text'
      },
      {
        id: 'email',
        header: "邮箱",
        type: 'text'
      },
      {
        id: 'company',
        header: "公司",
        type: 'text'
      },
      {
        id: "mobile",
        header: "联系方式",
        type: 'text'
      },
      {
        id: "contact_type",
        header: "联系人类型",
        type: 'mapping',
        options: 'CONTACT_TYPE'
      }, {
        id: "memo",
        header: "备注",
        type: 'text'
      },
    ],
    data: []
  };

  private destContactTableConfig: any = {
    columns: [
      {
        id: 'id',
        header: "联系人ID",
        type: 'text'
      },
      {
        id: 'name',
        header: "姓名",
        type: 'text'
      },
      {
        id: 'email',
        header: "邮箱",
        type: 'text'
      },
      {
        id: 'company',
        header: "公司",
        type: 'text'
      },
      {
        id: "mobile",
        header: "联系方式",
        type: 'text'
      },
      {
        id: "contact_type",
        header: "联系人类型",
        type: 'mapping',
        options: 'CONTACT_TYPE'
      }, {
        id: "memo",
        header: "备注",
        type: 'text'
      },
    ],
    data: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private cmm: CommonService,
    private errSvc: ErrorInfoService,
    private configSvc: EsbConfigsService,
    private tlSvc: TranLogService,
    private trSvc: TranResendService,
    private appSvc: AppRequestService,
    private esSvc: ErrorStepsService,
    private sysContSvc: SysContactsService
  ) { }

  private reBtn(): void {
    let obj = this;
    if (!this.hasReplayEntry) {
      window['esbLayer']({ type: 'alert', message: '该服务未提供重发入口，无法重发。' });
      return;
    }
    if (this.data3.length > 0) {
      this.trSvc.resend([{ tran_uuid: obj.data2.tran_uuid || '' }]).subscribe(
        success => window['esbLayer']({ type: 'alert', message: '操作成功！' }),
        error => window['esbLayer']({ type: 'error', message: error })
      );
    } else {
      window['esbLayer']({ type: 'alert', message: '未产生交易日志记录！' });
    }

  }

  private share(): void {
    let obj = this;
    let data = {
      tokens: this.tokens,
      error: this.data2
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ServicesListSharingDialogComponent,
      title: '您正在分享该页面，请输入本次分享的详细描述'
    })
      .setOnClose(function () {
        obj.queryData(
          obj.route.params['_value']['err_id']
        );
      });
  }

  private copy_post(step: any): void {
    let obj = this;
    if (this.err_data4.length > 0 && this.err_data4[this.err_data4.length - 1].err_step_name == '结束') {
      window['esbLayer']({ type: 'alert', message: "\"结束\"步骤节点无法添加步骤节点。" });
      return;
    }
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认复制建议步骤？" }).ok(
      () => {
        let copy_step = {
          err_id: obj.route.params['_value']['err_id'],
          user_id: window['currentUser']['user_code'],
          err_flow_id: step.err_flow_id,
          err_step_name: step.err_step_name,
          err_step_desc: step.err_step_desc,
          err_log_id: ''
        }
        obj.esSvc.createErrorstep(obj.route.params['_value']['err_id'], copy_step).subscribe(
          success => {
            window['esbLayer']({ type: 'alert', message: "复制成功！" });
            obj.queryData(
              obj.route.params['_value']['err_id']
            );
          },
          error => window['esbLayer']({ type: 'error', message: error })
        );
        confirmLayer.close();
      });
  }

  private endStep(): void {
    this.errSvc.updateErrorinfo({
      "err_id": this.route.params['_value']['err_id'],
      "user_id": window['currentUser']['user_code'],
      "err_status": "M002",
      "is_read": 0
    }).subscribe(
      success => window['esbLayer']({ type: 'alert', message: "流程生成成功！" }),
      error => window['esbLayer']({ type: 'error', message: error })
      );
  }

  private err_add(): void {
    if (this.err_data4.length > 0 && this.err_data4[this.err_data4.length - 1].err_step_name == '结束') {
      window['esbLayer']({ type: 'alert', message: "\"结束\"步骤节点无法添加步骤节点。" });
      return;
    }
    let obj = this;
    let data = {
      error_step: {
        err_id: this.route.params['_value']['err_id'],
        user_id: window['currentUser']['user_code'],
        err_flow_id: this.data2.err_flow_id
      },
      callback: (e) => {
        obj.queryData(
          obj.route.params['_value']['err_id']
        );
        window['esbLayer']({ type: 'alert', message: "保存成功！" });
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ErrorFlowDialogComponent,
      title: '新增错误步骤'
    });
  }

  private err_edit(error_step: any, index: string): void {
    let obj = this;
    let data = {
      error_step,
      callback: (e, type) => {
        if (type == 'del') {
          window['esbLayer']({ type: 'alert', message: "删除成功！" });
        }
        else {
          window['esbLayer']({ type: 'alert', message: "保存成功！" });
        }
        obj.queryData(
          obj.route.params['_value']['err_id']
        );
      }
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ErrorFlowDialogComponent,
      title: '修改错误步骤'
    });
  }

  private err_end(): void {
    if (this.err_data4.length > 0 && this.err_data4[this.err_data4.length - 1].err_step_name == '结束') {
      window['esbLayer']({ type: 'alert', message: "\"结束\"步骤节点无法添加步骤节点。" });
      return;
    }
    let obj = this;
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "确定要结束该流程？" }).ok(
      () => {
        let end_step = {
          err_id: this.route.params['_value']['err_id'],
          user_id: window['currentUser']['user_code'],
          err_flow_id: this.data2.err_flow_id,
          err_step_no: '999',
          err_step_name: '结束',
          op_result: null,
          err_step_desc: "结束流程"
        }
        obj.esSvc.createErrorstep(obj.route.params['_value']['err_id'], end_step).subscribe(
          success => {
            window['esbLayer']({ type: 'alert', message: "操作成功！" });
            obj.err_data4.push(success.body);
            obj.queryData(
              obj.route.params['_value']['err_id']
            );
            confirmLayer.close();
          },
          error => window['esbLayer']({ type: 'error', message: error })
        );
      });

  }

  private queryData(err_id: string, user_id?: string): void {
    let obj = this;

    err_id = err_id || '';
    // err_id = '34205';
    this.appSvc.afterInitCall(function () {
      // user_id = 'sesde8';
      // user_id = window['currentUser']['user_code'];
      obj.errSvc.queryUsersErrorinfoByErrId(err_id).subscribe(
        success => {
          obj.data2 = success.body.error || {};
          // obj.data2.last_upd_ts = obj.cmm.getFormatToTime(obj.data2.last_upd_ts);

          success.body && success.body.systems && success.body.systems.forEach(e => {
            if (obj.data2.src_sys.toUpperCase() == e.sys_name.toUpperCase()) {
              obj.src = e;
              obj.srcContactTableConfig.data = e.contacts;
            }
            else if (obj.data2.dest_sys.toUpperCase() == e.sys_name.toUpperCase()) {
              obj.dest = e;
              obj.destContactTableConfig.data = e.contacts;
            }
          });

          obj.tableConfig.data = obj.data3 = (success.body && success.body.tranlogs && success.body.tranlogs.map(v => {
            // v.tran_ts = obj.cmm.getFormatToTime(v.tran_ts);
            return v;
          })) || [];
          obj.setRowsClass();

          obj.errorflows = success.body.errflow || [];

          obj.err_data4 = success.body.errlog || [];

          obj.tokens = (success.body.tokens && success.body.tokens.map(v => {
            // v.expire_ts = obj.cmm.getFormatToDate(v.expire_ts);
            // v.create_ts = obj.cmm.getFormatToDate(v.create_ts);
            return v;
          })) || [];
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    });
  }

  private setRowsClass(): void {
    this.tableConfig.data = this.tableConfig.data.map(v => {
      if (v.tran_status == 'E001')
        v.class = 'table_trac_warning';
      return v;
    });
  }

  ngOnInit() {
    let obj = this;
    this.appSvc.afterInitCall(() => {
      obj.resendable = (window['currentUser'].is_admin != '0');
    });
    if (!!this.route.params['_value']['err_id'] && !!this.route.params['_value']['hasReplayEntry']) {
      this.hasReplayEntry = JSON.parse(this.route.params['_value']['hasReplayEntry']);
      this.queryData(
        this.route.params['_value']['err_id']
      );
    } else {
      this.router.navigate(['**']);
    }

    // this.err_reason = this.route.params['_value']['err_reason'];
  }
}
