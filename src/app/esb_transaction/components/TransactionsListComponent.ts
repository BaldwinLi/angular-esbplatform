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
  // private start_date: any = new window['moment']();
  private start_date: any;
  private end_date: any;
  // private _now: any = new window['moment']().add(8, 'hours').toISOString();
  private trancode: Array<any> = SGM_ESB_TRANCODE;
  private err_uu: Array<any>;
  private rowsCount: number = 0;
  private pageNow: number = 1;
  private pageTol: number = 10;
  private svcErrors: Array<any> = [];
  private svcName: string;
  private svcInfo: any = {
    'svc_no': '',
    'svc_id': '',
    'svc_desc': '',
    'project_name': '',
    'src_protocol': '',
    'src_sys': '',
    'dest_protocol': '',
    'dest_sys': '',
    'subsys': ''
  };

  private params: any;
  private tableConfig: any;
  constructor(
    private cmm: CommonService,
    private tls: TranLogService,
    private appSvc: AppRequestService,
    private userSvc: UsersInfoService,
    private configSvc: EsbConfigsService,
    private router: Router) { }

  valueChanged(event: any) {
    this.params.start = this.cmm.getFormatDateToStr(this.start_date.toString(), 'start');
    this.params.end = this.cmm.getFormatDateToStr(this.end_date.toString(), 'end');
    // let startDate = this.params.start = this.cmm.formatISOToStr(new window['moment'](this.start_date).add(8, 'hours').subtract(1, 'days').toISOString());
    // startDate = startDate.add(8, 'hours');
    // let endDate = this.params.end = this.cmm.formatISOToStr(new window['moment'](this.start_date).add(8, 'hours').add(1, 'days').toISOString());
    // this._now = new window['moment']().add(8, 'hours').toISOString();
    // if (parseInt(endDate) > parseInt(this.cmm.formatISOToStr(this._now))) {
    //   this.params.end = this.cmm.formatISOToStr(this._now);
    // this.start_date = new window['moment']();
    // this.start_date = new Date();
    // }
    // this.params.end = this.cmm.formatISOToStr(this.end_date.toISOString());
    // this.changeParams();
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
      if (this.svcErrors[e].usr_svcno === this.params.svcid) {
        this.getSvcInfo(this.svcErrors[e].svcno);
        this.svcInfo.subsys = this.svcErrors[e].subsys;
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
        for (let el of obj.svcErrors) {
          if (el['usr_svcno'] == svc_no) {
            obj.svcInfo.subsys = el.subsys;
            break;
          }
        }
        obj.refreshData();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  private initParams(): void {
    const obj = this;
    this.appSvc.afterInitCall(() => {
      // const user_id = window['currentUser']['user_code'];
      obj.userSvc.queryUsersServices().subscribe(
        success => {
          if (success.body && success.body.length > 0) {
            obj.svcErrors = success.body;
            if (!obj.params.svcid)
              obj.params.svcid = success.body && success.body[0].usr_svcno;

            // obj.params.svcid = 'S7066012';
            // obj.svcErrors = success.body.map(v=>{
            //   v.svcid = 'S7066012';
            //   return v;
            // });

            obj.svcName = obj.getSvcNameById;
            obj.getSvcInfo((success.body && success.body[0].svcno) || '');
          }
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );

    });

  }

  private refreshData(): void {
    if (!this.params.svcid) { return };
    const obj = this;
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
    // const svcid = this.params.svcid;
    // let svc_desc;
    // for (const e in this.svcErrors) {
    //   if (this.svcErrors[e].svcid === svcid) { svc_desc = this.svcErrors[e].svc_desc; }
    // }
    // this.svcInfo.tran_uuid=tran_uuid;
    window['tranListParams'] = {
      params: this.params,
      pageNow: this.pageNow,
      pageTol: this.pageTol,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.router.navigate(['/transactionhome/transactiondetail', { tran_uuid }]);
  }

  private getSort(column: any): void {
    this.params.sort = column.id;
    this.params.asc = column.isDesc ? 0 : 1;
    // console.log(this.params.sort + '  ' + this.params.asc);
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
    if (svc_obj && svc_obj.constructor.name !== 'FocusEvent') {
      if (this.params.svcid === (svc_obj && svc_obj.usr_svcno)) return;
      this.params.svcid = (svc_obj && svc_obj.usr_svcno) || '';
    } else {
      if (this.svcName === svc_obj.target.value) return;

      if (!!svc_obj) {
        this.svcName = svc_obj.target.value;
      } else {
        this.svcName = this.getSvcNameById;
      }
    }
    this.changeParams();
  }

  get getSvcNameById() {
    for (let el of this.svcErrors) {
      if (el['usr_svcno'] == this.params.svcid) {
        return el.usr_svcname;
      }
    }
    return ''
  }

  ngOnInit() {
    const obj = this;
    if (!!window['tranListParams']) {
      this.params = window['tranListParams'].params;
      this.start_date = window['tranListParams'].start_date;
      this.end_date = window['tranListParams'].end_date;
    } else {
      this.params = {
        start: this.cmm.getEsblastThreeDaysTimeStr,
        end: this.cmm.getEsbCurrentTimeStr,
        trancode: '',
        tran_uuid: '',
      };
      this.pageNow = 1;
      this.pageTol = 10;
      this.start_date = new window['moment']().subtract(3, 'days');
      this.end_date = new window['moment']();
    }
    // this.params = {
    //   start: this.cmm.getEsblastThreeMonthsTimeStr,
    //   end: this.cmm.getEsbCurrentTimeStr,
    //   // start: this.cmm.formatISOToStr(new window['moment'](this.start_date).add(8, 'hours').subtract(1, 'days').toISOString()),
    //   // end: this.cmm.formatISOToStr(new window['moment'](this.start_date).add(8, 'hours').toISOString()),
    //   trancode: '',
    //   // src: '',
    //   // dest: ''
    // };

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
          width: 500,
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
          id: 'biz_id',
          header: '业务主键',
          type: 'text'
        },
        {
          id: 'log_crt_ts',
          header: '时间',
          type: 'date',
          format: 'toTime',
          sort: 'server',
          isDesc: true,
          defaultSort: true,
          width: 150
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
    // this.end_date = obj.cmm.formatDate(obj.params.end, 'Time');
  }

  // get getTimeRangeStr() {
  //   let startDate = new window['moment'](this.start_date).add(8, 'hours').subtract(1, 'days').toISOString();
  //   // startDate = startDate.add(8, 'hours');
  //   let endDate = new window['moment'](this.start_date).add(8, 'hours').add(1, 'days').toISOString();
  //   if (parseInt(this.cmm.formatISOToStr(endDate)) > parseInt(this.cmm.formatISOToStr(this._now))) endDate = this._now;
  //   return this.cmm.getFormatToTime(startDate) + ' - ' + this.cmm.getFormatToTime(endDate);
  // }
}