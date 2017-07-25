import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common/CommonService';
import { AppRequestService } from '../../services/common/AppRequestService';
import { TranLogService } from '../../services/TranLogService';
import { UsersInfoService, } from '../../services/UsersInfoService';
import { NguiDatetime } from '@ngui/datetime-picker';
import { SGM_ESB_TRANCODE } from '../../model/data-model';
import { EsbConfigsService } from '../../services/EsbConfigsService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'esb-transactions-list',
  templateUrl: 'templates/transactionsList.html',
  providers: [CommonService, TranLogService]
})
export class TransactionsListComponent implements OnInit {
  private start_date: any;
  private end_date: any;
  private trancode: Array<any> = SGM_ESB_TRANCODE;
  private err_uu: Array<any>;
  private rowsCount: number = 0;
  private pageNow: number = 1;
  private pageTol: number = 10;
  private svcErrors: Array<any> = [];
  private svcInfo: any = {
    'svc_no': '',
    'svc_id': '',
    'svc_desc': '',
    'project_name': '',
    'src_protocol': '',
    'src_sys': '',
    'dest_protocol': '',
    'dest_sys': ''
  };

  private params: any = {
    start: this.cmm.getEsblastThreeMonthsTimeStr,
    end: this.cmm.getEsbCurrentTimeStr,
    trancode: '',
    src: '',
    dest: ''
  };
  private tableConfig: any;
  constructor(
    private cmm: CommonService,
    private tls: TranLogService,
    private appSvc: AppRequestService,
    private userSvc: UsersInfoService,
    private configSvc: EsbConfigsService,
    private router: Router) {
  }



  valueChanged(event: any) {
    this.params.start = this.cmm.formatISOToStr(this.start_date.toISOString());
    this.params.end = this.cmm.formatISOToStr(this.end_date.toISOString());
  }
  showDetail() {
    const lay = window['esbLayer']({
      type: 'loading'
    });
    setTimeout(() => lay.close(), 3000);
  }

  getPageNow(pageNow: number) {
    this.pageNow = pageNow;
    this.refreshData();

  }

  getPageTol(pageTol: number) {
    this.pageTol = pageTol;
    this.refreshData();
  }

  private changeParams(): void {
    for (const e in this.svcErrors) {
      if (this.svcErrors[e].svcid === this.params.svcid) {
        this.getSvcInfo(this.svcErrors[e].svc_no);
        this.refreshData();
        return;
      }
    }
    this.svcInfo = {
      'svc_no': '',
      'svc_id': '',
      'svc_desc': '',
      'project_name': '',
      'src_protocol': '',
      'src_sys': '',
      'dest_protocol': '',
      'dest_sys': ''
    };
    this.tableConfig.data = [];

  }
  // "svc_no": "I137",
  //     "svc_id": "SB995012",
  //     "svc_state": 0,
  //     "svc_name": "I137_PATAC-LL_PCRS_StatusSync",
  //     "svc_desc": "LL回传PCRS信息状态",
  //     "project_name": "PCRS",
  //     "src_protocol": "REST",
  //     "src_sys": "PATAC-LL",
  //     "dest_protocol": "REST",
  //     "dest_sys": "PCRS",
  private getSvcInfo(svc_no: string): void {
    const obj = this;
    this.configSvc.queryEsbConfigInfo(svc_no).subscribe(
      success => {
        obj.svcInfo = success.body || {};
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  private initParams(): void {
    const obj = this;
    this.appSvc.afterInitCall(() => {
      const user_id = window['currentUser']['user_code'];
      obj.userSvc.queryUserOverView(user_id).subscribe(
        success => {
          if (success.body.svc_errors && success.body.svc_errors.length > 0) {
            obj.svcErrors = success.body.svc_errors;
            obj.params.svcid = success.body.svc_errors && success.body.svc_errors[0].svcid;
            obj.getSvcInfo(success.body.svc_errors[0].svc_no);
            obj.refreshData();
          }
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );

    });

  }

  private refreshData(): void {
    if (!this.params.svcid) { return };
    const obj = this;
    // this.params.start = this.cmm.getFormatDateToStr(this.start_date.formatted, 'start');
    // this.params.end = this.cmm.getFormatDateToStr(this.end_date.formatted, 'end');
    this.tls.queryTranlogList(this.pageNow.toString(), this.pageTol.toString(), this.params).subscribe(
      success => {
        obj.tableConfig = {
          columns: obj.tableConfig.columns,
          data: obj.err_uu = (success.body && success.body.tranlogs) || []
        }
        obj.rowsCount = parseInt(success.body && success.body.pageinfo && success.body.pageinfo.recnum);
        obj.setRowsClass();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  // private changetime():void{
  //   this.refreshData();
  // }

  // ngOnChanges(changes: any){
  //   debugger;
  // }

  // ngAfterViewChecked() {
  //   this.params.start = this.cmm.getFormatDateToStr(this.startTime);
  //   this.params.end = this.cmm.getFormatDateToStr(this.endTime);
  // }
  private selectServiceById(tran_uuid: string, ) {
    const svcid = this.params.svcid;
    let svc_desc;
    for (const e in this.svcErrors) {
      if (this.svcErrors[e].svcid === svcid) { svc_desc = this.svcErrors[e].svc_desc; }
    }
    // this.svcInfo.tran_uuid=tran_uuid;
    this.router.navigate(['/transactionhome/transactiondetail', { tran_uuid }]);
  }

  private getSort(column: any): void {
    this.params.sort = column.id;
    this.params.asc = column.isDesc ? 1 : 0;
    console.log(this.params.sort + '  ' + this.params.asc);
    this.refreshData();
  }

  private setRowsClass(): void {
    this.err_uu = this.err_uu.map(v => {
      if (v.tran_status === 'E001') {
        v.class = 'table_trac_warning';
      }

      return v;
    });
  }

  private setParamsSvcid(svc_obj: any): void {
    this.params.svcid = (svc_obj && svc_obj.svcid) || '';
    this.changeParams();
  }

  get getSvcNameById() {
    for (let el of this.svcErrors) {
      if (el['svcid'] == this.params.svcid) {
        return el.svc_name;
      }
    }
    return ''
  }

  ngOnInit() {
    const obj = this;
    this.initParams();
    this.tableConfig = {
      columns: [
        {
          id: 'tran_code',
          header: '交易代码',
          type: 'text'
        },
        {
          id: 'tran_uuid',
          header: '交易UUID',
          type: 'template',
          template: {
            type: 'eventHandler',
            event: 'click',
            context: function (row, headers) {
              return row['tran_uuid'];
            },
            handler: function (row, headers) {
              obj.selectServiceById(row.tran_uuid || '');
            }
          }
        },
        {
          id: 'log_crt_ts',
          header: '时间',
          type: 'date',
          format: 'toTime',
          sort: 'server'
        },
        {
          id: 'tran_status',
          header: '交易状态',
          type: 'mapping',
          options: 'SGM_ESBMON_ERRSTATUS'
        },
        {
          id: 'src_sys',
          header: '源系统',
          type: 'text'
        },
        {
          id: 'dest_sys',
          header: '目标系统',
          type: 'text'
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
      data: this.err_uu
    };
    // this.start_date = obj.cmm.formatDate(obj.params.start, 'Time');
    this.end_date = new window['moment']();
    this.start_date = new window['moment']().subtract(3, 'months');
  }
}