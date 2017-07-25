import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UsersInfoService } from '../../services/UsersInfoService';
import { userInitialized } from '../../homeComponent';
import { AppRequestService } from '../../services/common/AppRequestService';

@Component({
  selector: 'esb-monitor-home',
  templateUrl: 'templates/monitorHome.html'
})
export class monitorHomeComponent {
  private trendingSvcNo: string;
  private svcErrors: Array<any> = [];
  private svcErrorsTrending: Array<any>;
  private selectedTrending: any;
  private showType: string = 'list';
  private tableConfig: any = {
    columns: [],
    data: []
  }
  constructor(private userSvc: UsersInfoService, private appSvc: AppRequestService, private router: Router) {
    let obj = this;
    obj.tableConfig.changed = false;
    appSvc.afterInitCall(function () {
      let user_id = window['currentUser']['user_code'];
      userSvc.queryUserOverView(user_id).subscribe(
        success => {
          obj.tableConfig = {
            columns: obj.tableConfig.columns,
            data: obj.svcErrors = success.body.svc_errors || []
          }
          obj.svcErrorsTrending = success.body.svc_errors_trend || [];
          obj.selectedTrending = success.body.svc_errors_trend && success.body.svc_errors_trend.length > 0 ? success.body.svc_errors_trend[0] : [];
          obj.trendingSvcNo = obj.selectedTrending.svc_no;
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    });
  }

  private changeTrending() {
    for (let el in this.svcErrorsTrending) {
      if (this.svcErrorsTrending[el].svc_no == this.trendingSvcNo) {
        this.selectedTrending = this.svcErrorsTrending[el];
        return;
      }
    }
    this.selectedTrending = {
      error_trend: []
    };
  }

  private runCallBack(func: any): void { }

  private selectServiceById(svc_no: string) {
    this.router.navigate(['/monitor/serviceslist', svc_no]);
  }

  private setTrendingSvcNo(svc_obj: any) {
    this.trendingSvcNo = (svc_obj && svc_obj.svc_no) || '';
    this.changeTrending();
  }

  get getSvcNameById() {
    for (let el of this.svcErrors) {
      if (el['svc_no'] == this.trendingSvcNo) {
        return el.svc_name;
      }
    }
    return ''
  }

  ngOnInit() {
    let obj = this;
    this.tableConfig = {
      columns: [
        '$index',
        {
          id: 'svc_no',
          header: "服务编号",
          type: 'text',
          sort: 'string'
        },
        {
          id: 'svc_name',
          header: "服务名称",
          type: 'template',
          template: {
            type: "eventHandler",
            event: "click",
            context: function (row, headers) {
              return row['svc_name'];
            },
            handler: function (row, headers) {
              obj.selectServiceById(row.svc_no || '');
            }
          }
        },
        {
          id: 'todayErrCnt',
          header: "处理中",
          type: 'text'
        },
        {
          id: 'totalErrCnt',
          header: "累计错误",
          type: 'text',
          sort: 'int'
        },
        {
          id: 'svc_desc',
          header: "错误描述",
          type: 'text'
        }
      ],
      data: this.svcErrors
    }

  }
}
