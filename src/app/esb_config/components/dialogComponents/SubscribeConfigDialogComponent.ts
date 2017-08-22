import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { assign } from 'lodash';
import { DialogComponent } from "../../../common/components/DialogComponent";
import { CommonService } from '../../../services/common/CommonService';
import { SysContactsService } from '../../../services/SysContactsService';
import { MdmConsumersService } from '../../../services/MdmConsumersService';

@Component({
    selector: 'esb-subscribe-dialog',
    templateUrl: 'templates/subscribeConfigDialog.html'
})
export class SubscribeConfigDialogComponent extends DialogComponent {
    private persons: any = {};
    private callback: any;
    private selectedData: Array<any> = [];
    private tableConfig: any = {
        primaryKey: 'sys_no',
        searchPlaceholder: '请输入系统简称进行查询',
        searchField: 'sys_name',
        beSelectedTableTitle: '系统列表',
        selectedTableTitle: '已订阅系统',
        beSeletedDatatable: {
            columns: [
                "$checkbox",
                {
                    id: 'sys_no',
                    header: "系统代码",
                    type: 'text',
                    width: '50'
                },
                {
                    id: 'sys_name',
                    header: "系统简称",
                    type: 'text',
                    width: '100'
                },
                {
                    id: 'full_name',
                    header: "系统描述",
                    type: 'text',
                    width: '200'
                }
            ],
            data: []
        },
        seletedDatatable: {
            columns: [
                "$checkbox",
                {
                    id: 'sys_no',
                    header: "系统代码",
                    type: 'text',
                    width: '60'
                },
                {
                    id: 'sys_name',
                    header: "系统简称",
                    type: 'text',
                    width: '80'
                },
                {
                    id: 'full_name',
                    header: "系统描述",
                    type: 'text',
                    width: '200'
                },
                {
                    id: 'memo',
                    header: "备注",
                    type: 'input',
                    inputType: 'text'
                }
            ],
            data: []
        },
        allData: []
    }

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private cmm: CommonService,
        private sysContactSvc: SysContactsService,
        private mdmSvc: MdmConsumersService
    ) {
        super(layerRef, layer, layComp);
    }

    ngOnInit() {
        let obj = this;
        setTimeout(() => {
            if (obj.persons) obj.refreshAllData();
        });
    }

    // ngOnChanges() {
    //     this.mappingConfigForm.setValue(this.persons);
    //     this.tableConfig.seletedDatatable.data = this.persons.svclist || [];
    // }

    private refreshAllData(): void {
        let obj = this;
        this.sysContactSvc.querySystemsAndContactsList().subscribe(
            success => {
                obj.tableConfig = assign(obj.tableConfig, {
                    allData: success.body && success.body.map(v => ({
                        sys_no: v.sys_no,
                        sys_name: v.sys_name,
                        full_name: v.full_name,
                    })) || [],
                    beSeletedDatatable: assign(obj.tableConfig.beSeletedDatatable, {
                        data: success.body && success.body.map(v => ({
                            sys_no: v.sys_no,
                            sys_name: v.sys_name,
                            full_name: v.full_name,
                        })) || []
                    })
                });
                obj.refreshSvcList();
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }

    private refreshSvcList(): void {
        let obj = this;
        this.mdmSvc.querySvcListConfig(this.persons.svc_no).subscribe(
            success => {
                obj.tableConfig.seletedDatatable.data = obj.selectedData = success.body && success.body.map(v => ({
                    sys_no: v.subsys_no,
                    sys_name: v.subsys_name,
                    full_name: v.subsys_fullname,
                    memo: v.subsys_memo
                })) || []
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }

    private subscribe_post(): void {
        let obj = this;
        this.mdmSvc.updateSvcListConfig(this.persons.svc_no, this.selectedData.map(v => ({
            usr_svcno: `${this.persons.svc_no}_${v.sys_name}`,
            usr_svcname: `${this.persons.svc_name}_${v.sys_name}`,
            svcno: this.persons.svc_no,
            subsys: v.sys_name,
            memo: v.memo
        }))).subscribe(
            success => {
                window['esbLayer']({ type: 'alert', message: '操作成功！' })
                obj.callback();
                obj.close();
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }

    private setSelectedData(data: any): void {
        this.selectedData = data;
    }
}