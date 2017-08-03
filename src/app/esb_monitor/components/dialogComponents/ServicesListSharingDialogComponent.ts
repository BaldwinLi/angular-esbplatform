import { Component, enableProdMode, Input } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
// import { CommonService } from '../../../services/common/CommonService';
import { TokenService } from '../../../services/TokenService';
import { RES_TYPES } from '../../../model/data-model';

//enable
enableProdMode();

@Component({
    selector: 'esb-sharing-dialog',
    templateUrl: 'templates/servicesListSharingDialog.html',
    providers: [NgLayer, NgLayerRef]
})
export class ServicesListSharingDialogComponent extends DialogComponent {

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        // private cmm: CommonService,
        private tokenSvc: TokenService
    ) {
        super(layerRef, layer, layComp);
    }

    private tokens: Array<any>;
    private error: any;
    private shareType: string;
    private share_desc: string = '';
    private shareLink: string;
    private bottonText: string = '复制链接';
    private titleText: string = '复制到剪切板';
    private shareSuccess: boolean = false;
    private shareSuccessText: string = '';

    private tableConfig: any = {
        columns: [],
        data: []
    };

    private share() {
        let obj = this;
        let params = {
            usercode: window['currentUser'].user_code,
            token_desc: this.share_desc,
            expire_in: 30,
            res_type: this.shareType,
            res_key: this.error.err_id || this.error.tran_uuid || ''
        }
        this.tokenSvc.createToken(params).subscribe(
            success => {
                obj.shareSuccess = true;
                obj.shareLink = `${window.location.origin}/esbmon_public/#/${RES_TYPES[obj.shareType]}?token=${success.body && success.body[0] && success.body[0].token}`;
                obj.title('分享成功！');
                obj.shareSuccessText = '分享成功！您分享的链接为：';
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );

    }

    private copyToClipBoard(): void {
        $('#copy_botton')['tooltip']('destroy');
        let target = $('#sharing_url');
        try {
            target.select();
            document.execCommand('copy');
            this.titleText = '复制成功';
        } catch (e) {
            this.titleText = '复制失败';
        }
        $('#copy_botton').attr('title', this.titleText)['tooltip']('show');
    }

    private destoryTooltip() {
        $('#copy_botton')['tooltip']('destroy');
    }

    private copyToClipBoard_tablerow(row: any): void {
        $('#' + row.token)['tooltip']('destroy');
        let target = $('#' + row.token + '_url');
        try {
            target.select();
            document.execCommand('copy');
            this.titleText = '复制成功';
        } catch (e) {
            this.titleText = '复制失败';
        }
        $('#' + row.token).attr('title', this.titleText)['tooltip']('show');
    }

    private destoryTooltip_tablerow(row: any) {
        $('#' + row.token)['tooltip']('destroy');
    }

    ngOnInit() {
        let obj = this;
        setTimeout(() => {
            obj.shareType = obj.error.err_id ? 'error' : (obj.error.tran_uuid ? 'tran' : '');
            obj.tableConfig = {
                columns: [
                    {
                        header: "链接",
                        type: 'template',
                        width: '300',
                        template: {
                            type: "html",
                            tempBuilder: function (row, headers) {
                                return "<input id='" + row.token + '_url' + "' " +
                                    "readonly class='form-control' style='width: 100%; float: left;' " +
                                    "type='text' value='" + window.location.origin + '/esbmon_public/#/' +
                                    (RES_TYPES[obj.shareType]) +
                                    '?token=' + row.token + "'>";
                            },
                            on: {
                                click: obj.copyToClipBoard_tablerow.bind(obj),
                                mouseleave: obj.destoryTooltip_tablerow.bind(obj)
                            }
                        }
                    },
                    {
                        id: "create_ts",
                        header: "创建日期",
                        type: 'date',
                        format: 'toDate',
                        width: '150'
                    },
                    {
                        id: 'expire_ts',
                        header: "失效日期",
                        type: 'date',
                        format: 'toDate',
                        width: '150'
                    },
                    {
                        header: "复制",
                        type: 'template',
                        width: '80',
                        template: {
                            type: "html",
                            tempBuilder: function (row, headers) {
                                return "<button id='" + row.token + "' " +
                                    "style='margin-left:2px; float: left; height: 31px;' " +
                                    "type='button' " +
                                    "class='btn btn-default' " +
                                    "data-toggle='tooltip' data-placement='bottom' title='复制到剪贴板'>" +
                                    "复制链接</button>";
                            },
                            on: {
                                click: obj.copyToClipBoard_tablerow.bind(obj),
                                mouseleave: obj.destoryTooltip_tablerow.bind(obj)
                            }
                        }
                    }
                ],
                data: obj.tokens
            }
        });
    }
}