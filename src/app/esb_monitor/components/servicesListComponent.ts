import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SGM_ESBMON_ERRSTATUS } from '../../model/data-model';
import { ServicesListDialogComponent } from './dialogComponents/ServicesListDialogComponent';
import { ServicesListSharingDialogComponent } from './dialogComponents/ServicesListSharingDialogComponent';
import { CommonService } from '../../services/common/CommonService';
import { ErrorInfoService } from '../../services/ErrorInfoService';
import { TranResendService } from '../../services/TranResendService';
import { AppRequestService } from '../../services/common/AppRequestService';
import { ArrListDialogComponent } from '../../common/components/ArrListDialogComponent';

@Component({
  selector: 'esb-services-list',
  templateUrl: 'templates/servicesList.html'
})
export class servicesListComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cmm: CommonService,
    private errSvc: ErrorInfoService,
    private appSvc: AppRequestService,
    private resendSvc: TranResendService
  ) { }
  private start_date: any;
  private end_date: any;
  private hasReplayEntry: boolean = false;
  private resendable: boolean = false;
  private errors: Array<any> = [];
  private err_status = SGM_ESBMON_ERRSTATUS;
  private isCheckAll: boolean;
  private rowsCount: number = 0;
  private pageNow: number;
  private pageTol: number;
  private params: any;
  private searchBy: string = 'all';

  private tableConfig: any = {
    columns: [],
    data: []
  };

  private selectedItems: Array<any>;

  valueChanged(event: any) {
    this.params.start_ts = this.cmm.getFormatDateToStr(this.start_date.toString(), 'start')
    this.params.end_ts = this.cmm.getFormatDateToStr(this.end_date.toString(), 'end');
  }
  private getSelectedItems(selectedItems: Array<any>): void {
    this.selectedItems = selectedItems;
  }

  private openResentHistory(): void {
    let obj = this;
    let dataObject = {
      columns: [
        {
          id: 'err_id',
          header: "错误ID",
          type: 'text',
          width: '60'
        },
        {
          id: 'service_name',
          header: "服务名",
          type: 'text',
          width: '400'
        },
        {
          id: 'err_type_code',
          header: "故障类别",
          type: 'text',
          width: '100'
        },
        {
          id: 'err_msg',
          header: "故障信息",
          type: 'text',
          width: '100'
        },
        {
          id: "err_status",
          header: "错误状态",
          type: 'mapping',
          options: 'SGM_ESBMON_ERRSTATUS',
          width: '80'
        },
        {
          id: "err_level",
          header: "故障严重性",
          type: 'mapping',
          options: 'EVENT_LEVELS',
          width: '110'
        }
      ],
      data: []
    }
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: dataObject,
      dialogComponent: ArrListDialogComponent,
      title: '重发历史记录列表'
    });
  }

  private resend(): void {
    let data = {};
    let obj = this;
    if (!this.hasReplayEntry) {
      window['esbLayer']({ type: 'alert', message: '该服务未提供重发入口，无法重发。' });
      return;
    }
    if (!this.selectedItems || this.selectedItems.length == 0) {
      window['esbLayer']({ type: 'alert', message: '请选择至少一条数据。' });
      return;
    }
    data['errors'] = this.selectedItems;
    data['okCallback'] = function (trans) {
      obj.resendSvc.resend(trans.map(v => {
        return { tran_uuid: v.tran_uuid };
      })).subscribe(
        success => window['esbLayer']({ type: 'alert', message: '操作完成！' }),
        error => window['esbLayer']({ type: 'error', message: error })
        );
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ServicesListDialogComponent,
      title: '批量重发数据列表'
    });
  }

  private ignore(): void {
    let obj = this;
    let data = {};
    if (!this.selectedItems || this.selectedItems.length == 0) {
      window['esbLayer']({ type: 'alert', message: '请选择至少一条数据。' });
      return;
    }
    data['errors'] = this.selectedItems;
    data['okCallback'] = function (trans) {
      obj.resendSvc.resend(trans.map(v => {
        return {
          tran_uuid: v.tran_uuid,
          replay_code: '100'
        };
      }), 'ignore').subscribe(
        success => {
          obj.refreshData();
          window['esbLayer']({ type: 'alert', message: '操作完成！' });
        },
        error => window['esbLayer']({ type: 'error', message: error })
        );
    };
    let dialog = window['esbLayer']({
      type: 'dialog',
      data: data,
      dialogComponent: ServicesListDialogComponent,
      title: '批量忽略数据列表'
    });
  }

  private today(): void {
    this.searchBy = 'day';
    this.params.start_ts = this.cmm.getCurrentDayStartTime;
    this.params.end_ts = this.cmm.getCurrentTime;
    this.refreshData();
  }

  private weeks(): void {
    this.searchBy = 'week';
    this.params.start_ts = this.cmm.getCurrentWeekStartTime;
    this.params.end_ts = this.cmm.getCurrentTime;
    this.refreshData();
  }

  private mouths(): void {
    this.searchBy = 'month';
    this.params.start_ts = this.cmm.getCurrentMonthStartTime;
    this.params.end_ts = this.cmm.getCurrentTime;
    this.refreshData();
  }

  private queryAll(): void {
    this.searchBy = 'all';
    delete this.params.start_ts;
    delete this.params.end_ts;
    this.refreshData();
  }

  private selectServiceById(err_id: string) {
    window['svcListParams'] = {
      params: this.params,
      pageNow: this.pageNow,
      pageTol: this.pageTol,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.router.navigate(['/monitor/servicedetail', {
      err_id,
      // hasReplayEntry: this.hasReplayEntry 
    }]);
  }

  private getPageNow(pageNow: number) {
    this.pageNow = pageNow;
    this.refreshData(this.params);
  }

  private getPageTol(pageTol: number) {
    this.pageTol = pageTol;
    this.refreshData(this.params);
  }

  private refreshData(params?: any): void {
    let obj = this;
    this.errSvc.queryErrorinfo(
      params || this.params,
      this.pageNow || window['svcListParams'].pageNow,
      this.pageTol || window['svcListParams'].pageTol
    ).subscribe(
      success => {
        obj.rowsCount = parseInt(success.body && success.body.pageinfo && success.body.pageinfo.recnum);
        if (!!window['svcListParams'] && !obj.pageNow && !obj.pageTol) {
          obj.pageNow = window['svcListParams'].pageNow;
          obj.pageTol = window['svcListParams'].pageTol;
        }
        obj.tableConfig.data = obj.errors = (success.body && success.body.errorinfo && success.body.errorinfo.map(v => {
          // v.last_upd_ts = obj.cmm.getFormatToTime(v.last_upd_ts);
          return v;
        })) || [];
        obj.setRowsClass();
        obj.hasReplayEntry = (success.body && success.body.replayEntry != 'NA');

      },
      error => window['esbLayer']({ type: 'error', message: error })
      );

  }

  private setRowsClass(): void {
    this.errors = this.errors.map(v => {
      if (v.err_status == 'E001')
        v.class = 'table_error';
      else if (v.err_status == 'M001')
        v.class = 'table_normal';
      else if (v.err_status == 'M000')
        v.class = 'table_warning';
      else if (v.err_status == 'M002')
        v.class = 'table_good';
      else
        v.class = '';
      return v;
    });
  }

  private getSort(column: any): void {
    this.params.sort = column.id;
    this.params.asc = column.isDesc ? 0 : 1;
    // console.log(this.params.sort + '  ' + this.params.asc);
    this.refreshData();
  }

  ngOnInit() {
    let obj = this;
    if (!!window['svcListParams'] && (this.route.params['_value']['svc_no'] == window['svcListParams'].params.svc_no)) {
      this.params = window['svcListParams'].params;
      this.start_date = window['svcListParams'].start_date;
      this.end_date = window['svcListParams'].end_date;
    } else {
      this.params = {
        svc_no: this.route.params['_value']['svc_no'],
        biz_id: '',
        err_status: '',
        start_ts: '',
        end_ts: ''
      }
      this.pageNow = 1;
      this.pageTol = 10;
      this.start_date = new window['moment']().subtract(3, 'months');
      this.end_date = new window['moment']();
      this.start_date = '';
      this.end_date = '';
    }
    // this.refreshData();
    this.appSvc.afterInitCall(() => {
      obj.resendable = (window['currentUser'].is_admin != '0');
    });
    this.tableConfig = {
      columns: [
        "$checkbox",
        "$index",
        {
          id: 'err_id',
          header: "错误ID",
          type: 'template',
          template: {
            type: "eventHandler",
            event: "click",
            context: function (row, headers) {
              return row['err_id'];
            },
            handler: function (row, headers) {
              obj.selectServiceById(row.err_id || '');
            }
          }
        },
        // {
        //   id: 'service_name',
        //   header: "服务名",
        //   type: 'text'
        // },
        {
          id: 'src_sys',
          header: "源系统",
          type: 'text'
        },
        {
          id: 'dest_sys',
          header: "目标系统",
          type: 'text'
        },
        {
          id: 'biz_id',
          header: "业务主键",
          type: 'text'
        },
        {
          id: 'err_type_code',
          header: "故障类别",
          type: 'text'
        },
        {
          id: 'err_msg',
          header: "故障信息",
          type: 'text'
        },
        {
          id: "err_status",
          header: "错误状态",
          type: 'mapping',
          options: 'SGM_ESBMON_ERRSTATUS'
        },
        {
          id: "err_level",
          header: "故障严重性",
          type: 'mapping',
          options: 'EVENT_LEVELS',
          sort: 'server',
          isDesc: true
        },
        {
          id: "last_upd_ts",
          header: "修改时间",
          type: 'date',
          format: 'toTime',
          sort: 'server',
          isDesc: true,
          defaultSort: true,
          width: 150
        }
      ],
      data: this.errors
    };
  }
}
