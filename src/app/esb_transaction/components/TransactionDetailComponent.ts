import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
// import { CommonService } from '../../services/common/CommonService';
import { TranLogService } from '../../services/TranLogService';
import { AppRequestService } from '../../services/common/AppRequestService';
import { ServicesListSharingDialogComponent } from '../../esb_monitor/components/dialogComponents/ServicesListSharingDialogComponent';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'esb-transaction-detail',
  templateUrl: 'templates/transactionDetail.html'
})
export class TransactionDetailComponent implements OnInit {
  private trans: Array<any> = [];
  private tokens: Array<any>;
  private svcInfo: any = {
    svc_id: '',
    svc_no: '',
    svc_desc: '',
    project_name: '',
    src_protocol: '',
    src_sys: '',
    dest_protocol: '',
    dest_sys: ''
  };
  private tableConfig: any = {
    columns: [
      {
        id: 'tran_code',
        header: '交易代码',
        type: 'text'
      },
      {
        id: 'tran_uuid',
        header: '交易UUID',
        type: 'text'
      },
      {
        id: 'tran_ts',
        header: '时间',
        type: 'date',
        format: 'toTime'
      },
      {
        id: 'tran_status',
        header: '状态',
        type: 'mapping',
        options: 'SGM_ESBMON_ERRSTATUS'
      },
      {
        header: '详细信息',
        type: 'template',
        class: 'mess',
        template: {
          type: 'link',
          context: function (row, headers) {
            return '查看';
          },
          link: function (row, headers) {
            return row.log_url;
          },
          target: '_blank'
        }
      }
    ],
    data: this.trans,
    isStaticPagination: true
  };

  constructor(
    private route: ActivatedRoute,
    // private cmm: CommonService,
    private tlSvc: TranLogService,
    private appSvc: AppRequestService,
  ) { }

  private share(): void {
    const obj = this;
    const data = {
      tokens: this.tokens,
      error: { tran_uuid: this.route.params['_value']['tran_uuid'] }
    };
    const dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ServicesListSharingDialogComponent,
      title: '您正在分享该页面，请输入本次分享的详细描述'
    })
      .setOnClose(function () {
        obj.queryData(
          obj.route.params['_value']['tran_uuid']
        );
      });
  }

  private queryData(tran_uuid: string): void {
    const obj = this;
    this.appSvc.afterInitCall(function () {
      obj.tlSvc.queryTranlogbyUuid(tran_uuid).subscribe(
        success => {
          obj.tableConfig.data = obj.trans = (success.body && success.body.tranlogs && success.body.tranlogs.map(v => {
            return v;
          })) || [];
          obj.setRowsClass();

          obj.svcInfo = success.body && success.body.svcinfo;
          obj.tokens = (success.body.tokens && success.body.tokens.map(v => {
            return v;
          })) || [];
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    });
  }

  private setRowsClass(): void {
    this.tableConfig.data = this.tableConfig.data.map(v => {
      if (v.tran_status === 'E001') {
         v.class = 'table_trac_warning';
      }
      return v;
    });
  }

  ngOnInit() {
    this.queryData(
      this.route.params['_value']['tran_uuid']
    );
  }
}
