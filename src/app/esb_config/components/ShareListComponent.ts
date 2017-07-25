import { Component } from '@angular/core';
import { AppRequestService } from '../../services/common/AppRequestService';
import { CommonService } from '../../services/common/CommonService';
import { TokenService } from '../../services/TokenService';

@Component({
  selector: 'esb-share-list',
  templateUrl: 'templates/sharelist.html'
})
export class ShareListComponent {

  constructor(private cmm: CommonService, private appSvc: AppRequestService, private tokenSvc: TokenService) {

  }
  private tokens: Array<any> = [];

  private userId: string;
  private shareId: string;
  private rowsCount: number = 0;
  private pageNow: number = 1;
  private pageTol: number = 10;

  private tableConfig: any = {
    columns: [
      {
        id: 'token',
        header: "Token",
        type: 'template',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            const url = `${window.location.origin}/esbmon_public/#/${row.res_type == 'error' ? 'servicedetail' : (row.res_type == 'tran' ? 'transactiondetail' : '')}?token=${row.token}`;
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
    data: this.tokens
  };

  private search(event): void {
    if (event && event.type == 'keypress' && event.charCode !== 13) return;
    this.refreshData(this.userId);
  }

  private getPageNow(pageNow: number) {
    this.pageNow = pageNow;
    this.refreshPageData();
  }

  private getPageTol(pageTol: number) {
    this.pageTol = pageTol;
    this.refreshPageData();
  }

  private refreshData(user_id?: string): void {
    let obj = this;
    this.appSvc.afterInitCall(() => {
      obj.tokenSvc.queryTokensList().subscribe(
        success => {
          obj.tokens = success.body || [];
          obj.refreshPageData();
        },
        error => window['esbLayer']({ type: 'error', message: error })
      );
    });
  }

  private refreshPageData(): void {
    let tableDataInfo = this.cmm.getPageData(this.tokens, this.pageNow, this.pageTol);
    this.rowsCount = tableDataInfo.rowsCount;
    this.tableConfig.data = tableDataInfo.currentPageRows
  }

  ngOnInit() {
    let obj = this;
    this.refreshData();
  }
}
