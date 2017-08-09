import { Component } from '@angular/core';
import { startsWith, assign } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROLE } from '../../../model/data-model';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { UsersInfoService } from '../../../services/UsersInfoService';
import { CommonService } from '../../../services/common/CommonService';

@Component({
    selector: 'esb-mapping-dialog',
    templateUrl: 'templates/mappingConfigDialog.html'
})
export class MappingConfigDialogComponent extends DialogComponent {

    private mappingConfigForm = this.mappingConfigFormBuilder.group({
        user_code: ['', Validators.required],
        user_name: ['', Validators.required],
        is_admin: [0, Validators.required],
        memo: ''
    });
    private persons: any = [];
    private roles: Array<any> = ROLE;
    private callback: any;
    private selectedData: Array<any> = [];
    private tableConfig: any = {
        primaryKey: 'usr_svcno',
        searchPlaceholder: '请输入服务编号进行查询',
        searchField: 'usr_svcno',
        beSelectedTableTitle: '服务列表',
        selectedTableTitle: '已选服务',
        beSeletedDatatable: {
            columns: [
                "$checkbox",
                {
                    id: 'usr_svcno',
                    header: "服务编号",
                    type: 'text',
                    width: '100'
                },
                {
                    id: 'usr_svcname',
                    header: "服务名称",
                    type: 'text',
                    width: '300'
                },
            ],
            data: []
        },
        seletedDatatable: {
            columns: [
                "$checkbox",
                {
                    id: 'usr_svcno',
                    header: "服务编号",
                    type: 'text',
                    width: '100'
                },
                {
                    id: 'usr_svcname',
                    header: "服务名称",
                    type: 'text',
                    width: '300'
                },
            ],
            data: []
        },
        allData: []
    }

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private userSvc: UsersInfoService,
        private mappingConfigFormBuilder: FormBuilder,
        private cmm: CommonService
    ) {
        super(layerRef, layer, layComp);
    }

    ngOnInit() {
        let obj = this;
        // this.mappingConfigForm = this.mappingConfigFormBuilder.group({
        //     user_code: ['', Validators.required],
        //     user_name: ['', Validators.required],
        //     is_admin: [0, Validators.required],
        //     memo: ''
        // });
        setTimeout(() => {
            if (obj.persons) {
                obj.mappingConfigForm.patchValue(obj.persons);
                //  = obj.mappingConfigFormBuilder.group({
                //     user_code: [obj.persons.user_code, Validators.required],
                //     user_name: [obj.persons.user_name, Validators.required],
                //     is_admin: [obj.persons.is_admin, Validators.required],
                //     memo: obj.persons.memo
                // });
                obj.tableConfig.seletedDatatable.data = obj.persons.svclist || [];
            }
        });
        this.refreshData();
    }

    // ngOnChanges() {
    //     this.mappingConfigForm.setValue(this.persons);
    //     this.tableConfig.seletedDatatable.data = this.persons.svclist || [];
    // }

    private refreshData(): void {
        let obj = this;
        this.userSvc.queryUsersServices().subscribe(
            success => {
                obj.tableConfig = assign(obj.tableConfig, {
                    allData: success.body || [],
                    beSeletedDatatable: assign(obj.tableConfig.beSeletedDatatable, {
                        data: success.body || []
                    })
                });
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }

    private user_post(): void {
        if (this.cmm.isInvalidForm(this.mappingConfigForm)) return;
        let obj = this;
        this.userSvc.updateUsersInfo_V2([{
            user: this.mappingConfigForm.value,
            svclist: obj.selectedData
        }]).subscribe(
            success => {
                window['esbLayer']({ type: 'alert', message: "操作成功！" });
                obj.callback && obj.callback();
                obj.close();
            },
            error => window['esbLayer']({ type: 'error', message: error })
            );
    }

    private setSelectedData(data: any): void {
        this.selectedData = data;
    }
}