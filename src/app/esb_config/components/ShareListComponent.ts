import { Component } from '@angular/core';
import { AppRequestService } from '../../services/common/AppRequestService';
import { CommonService } from '../../services/common/CommonService';
import { TokenService } from '../../services/TokenService';
import { RES_TYPES } from '../../model/data-model';

@Component({
  selector: 'esb-share-list',
  templateUrl: 'templates/sharelist.html'
})
export class ShareListComponent {

  constructor(private cmm: CommonService, private appSvc: AppRequestService, private tokenSvc: TokenService) {

  }
  private tokens: Array<any> = [];

  private tableConfig: any = {
    columns: [
      {
        id: 'token',
        header: "Token",
        type: 'template',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            const url = `${window.location.origin}/esbmon_public/#/${RES_TYPES[row.res_type]}?token=${row.token}`;
            return `<a style='color: #00f;' href='${url}' target='_blank'>${row.token}</i>`
          }
        }
      },
      {
        id: 'res_type',
        header: '分享类型',
        type: 'mapping',
        options: 'RES_TYPE'
      },
      {
        id: 'expire_ts',
        header: '失效时间',
        type: 'date',
        format: 'toDate'
      },
      {
        id: 'expire_in',
        header: '剩余天数',
        type: 'text'
      },
      {
        id: 'token_desc',
        header: '描述',
        type: 'text'
      }
    ],
    data: this.tokens,
    isStaticPagination: true
  };

  private refreshData(user_id?: string): void {
    let obj = this;
    this.appSvc.afterInitCall(() => {
      obj.tokenSvc.queryTokensList().subscribe(
        success => {
          obj.tokens = success.body || [];
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    });
  }

  ngOnInit() {
    this.refreshData();
  }
}
