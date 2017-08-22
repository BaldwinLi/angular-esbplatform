import { Component } from '@angular/core';
import { assign } from 'lodash';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErrorStepsService } from '../../../services/ErrorStepsService';
import { CommonService } from '../../../services/common/CommonService';

@Component({
    selector: 'esb-errorflow-dialog',
    templateUrl: 'templates/errorFlowConfigEditDialog.html'
})
export class ErrorFlowConfigEditDialogComponent extends DialogComponent {
    // export class ErrorFlowDialogComponent {
    private ErrorFlowForm = this.ErrorFlowFormBuilder.group({
        err_step_id: '',
        err_step_name: ['', Validators.required],
        err_step_desc: ''
    });
    private error_step: any;
    private callback: any;

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private ErrorFlowFormBuilder: FormBuilder,
        private esSvc: ErrorStepsService,
        private cmm: CommonService
    ) {
        super(layerRef, layer, layComp);
    }

    ngOnInit() {
        let obj = this;
        setTimeout(() => {
            if (obj.error_step) {
                obj.ErrorFlowForm.patchValue(obj.error_step);
            }
        });
    }

    private err_del(err_log_id: string, index: number): void {
        let obj = this;
        let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
            () => {
                obj.callback(assign({err_step_no: this.error_step.err_step_no}, this.ErrorFlowForm.value), 'del');
                confirmLayer.close();
                obj.close();
            });
    }

    private err_post(): void {
        if (this.cmm.isInvalidForm(this.ErrorFlowForm)) return;
        let obser;
        let obj = this;
        let postPbj = this.ErrorFlowForm.value;
        if(!!this.error_step) postPbj = assign({err_step_no: this.error_step.err_step_no}, this.ErrorFlowForm.value);
        this.callback(postPbj);
        this.close();
    }
}
