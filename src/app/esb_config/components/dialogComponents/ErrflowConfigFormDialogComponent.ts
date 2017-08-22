import { Component } from '@angular/core';
import { startsWith, assign } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROLE } from '../../../model/data-model';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { UsersInfoService } from '../../../services/UsersInfoService';
import { ErrorFlowsService } from '../../../services/ErrorFlowsService';
import { CommonService } from '../../../services/common/CommonService';
import { ErrorFlowConfigEditDialogComponent } from './ErrorFlowConfigEditDialogComponent';

@Component({
    selector: 'esb-mapping-dialog',
    templateUrl: 'templates/errflowFormConfigDialog.html'
})
export class ErrflowConfigFormDialogComponent extends DialogComponent {

    private ErrflowConfigForm = this.ErrflowConfigFormBuilder.group({
        err_flow_id: '',
        err_flow_no: ['', Validators.required],
        err_flow_desc: '',
    });
    private persons: any = [];
    private errorflows: Array<any> = [];
    private callback: any;

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private userSvc: UsersInfoService,
        private ErrflowConfigFormBuilder: FormBuilder,
        private errFlowSvc: ErrorFlowsService,
        private cmm: CommonService
    ) {
        super(layerRef, layer, layComp);
    }

    ngOnInit() {
        let obj = this;
        setTimeout(() => {
            if (obj.persons) {
                obj.ErrflowConfigForm.patchValue(obj.persons);
                obj.errorflows = obj.persons['err_steps'] && obj.persons['err_steps'].sort((p, n) => p.err_step_no - n.err_step_no);
            }
        });
    }

    // ngOnChanges() {
    //     this.mappingConfigForm.setValue(this.persons);
    //     this.tableConfig.seletedDatatable.data = this.persons.svclist || [];
    // }

    // private refreshData(): void {
    //     let obj = this;
    //     this.userSvc.queryUsersServices().subscribe(
    //         success => {
    //             obj.tableConfig = assign(obj.tableConfig, {
    //                 allData: success.body || [],
    //                 beSeletedDatatable: assign(obj.tableConfig.beSeletedDatatable, {
    //                     data: success.body || []
    //                 })
    //             });
    //         },
    //         error => window['esbLayer']({ type: 'error', message: error })
    //     );
    // }

    private flow_post(): void {
        if (this.cmm.isInvalidForm(this.ErrflowConfigForm)) return;
        let obj = this;
        let postObj = this.ErrflowConfigForm.value;
        postObj.err_steps = obj.errorflows;
        if (!postObj.err_flow_id) {
            obj.errFlowSvc.createErrorflowV2(postObj).subscribe(
                success => {
                    window['esbLayer']({ type: 'alert', message: "操作成功！" })
                    obj.callback();
                    obj.close();
                },
                error => window['esbLayer']({ type: 'error', message: error })
            );
        } else {
            obj.errFlowSvc.updateErrorflowV2(postObj).subscribe(
                success => {
                    window['esbLayer']({ type: 'alert', message: "操作成功！" })
                    obj.callback();
                    obj.close();
                },
                error => window['esbLayer']({ type: 'error', message: error })
            );
        }
    }

    private queryData(): void {
        this.ErrflowConfigForm.value['flow_id'];
    }
    private edit_step(step: any): void {
        let obj = this;
        let data = {
            error_step: step,
            callback: (e, type) => {
                if (type == 'del') {
                    obj.errorflows = obj.errorflows.filter((el) => {
                        return el.err_step_no != e.err_step_no;
                    });
                }
                else {
                    obj.errorflows = obj.errorflows.map((v) => {
                        if (v.err_step_no == e.err_step_no) return e;
                        else return v;
                    });
                }
            }
        };
        let dialog = window['esbLayer']({
            type: 'dialog',
            data: data,
            dialogComponent: ErrorFlowConfigEditDialogComponent,
            title: '修改错误步骤'
        });
    }

    private add_step(): void {
        let obj = this;
        let data = {
            callback: (e, type) => {

                if (!!obj.errorflows && obj.errorflows.length > 0)
                    e.err_step_no = obj.errorflows[obj.errorflows.length - 1].err_step_no + 1;
                else {
                    e.err_step_no = 1;
                    obj.errorflows = [];
                }

                obj.errorflows.push(e);
            }
        };
        let dialog = window['esbLayer']({
            type: 'dialog',
            data: data,
            dialogComponent: ErrorFlowConfigEditDialogComponent,
            title: '修改错误步骤'
        });
    }
}