import { Component } from '@angular/core';
import { assign } from 'lodash';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStepsService } from '../../../services/ErrorStepsService';

@Component({
    selector: 'esb-errorflow-dialog',
    templateUrl: 'templates/errorFlowFromDialog.html'
})
export class ErrorFlowDialogComponent extends DialogComponent {
    // export class ErrorFlowDialogComponent {
    private ErrorFlowForm;
    private error_step: any;
    private callback: any;

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private ErrorFlowFormBuilder: FormBuilder,
        private esSvc: ErrorStepsService
    ) {
        super(layerRef, layer, layComp);
    }

    ngOnInit() {
        let obj = this;
        let formObj = {
            err_id: '',
            err_flow_id: '',
            err_log_id: '',
            err_step_name: '',
            err_step_desc: '',
            op_result: '',
            user_id: ''
        };
        this.ErrorFlowForm = this.ErrorFlowFormBuilder.group(formObj);
        setTimeout(() => {
            if (obj.error_step) {
                obj.ErrorFlowForm = obj.ErrorFlowFormBuilder.group(assign(formObj, obj.error_step));
            }
        });
    }

    private err_del(err_log_id: string, index: number): void {
        let obj = this;
        let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
            () => {
                obj.esSvc.deleteErrorstep(obj.error_step.err_log_id).subscribe(
                    success => {
                        obj.callback && obj.callback({}, 'del');
                        obj.close();
                        confirmLayer.close();
                    },
                    error => window['esbLayer']({ type: 'error', message: error })
                );
            });
    }

    private err_post(): void {
        let obser;
        let obj = this;
        let postPbj = this.ErrorFlowForm.value;
        if (!this.error_step.err_log_id) {
            obser = this.esSvc.createErrorstep(obj.error_step.err_id, postPbj);
        } else {
            obser = this.esSvc.updateErrorstep(obj.error_step.err_id, postPbj);
        }
        obser.subscribe(
            success => {
                if (!obj.error_step.err_log_id) {
                    postPbj = success.body || {};
                }
                obj.callback && obj.callback(postPbj);
                obj.close();
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }
}
