import { Component } from '@angular/core';
import { assign } from 'lodash';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailInfoService } from '../../../services/EmailInfoService';
import { CommonService } from '../../../services/common/CommonService';

@Component({
  selector: 'esb-email-dialog',
  templateUrl: 'templates/emailConfigFormDialog.html'
})
export class EmailConfigFormDialogComponent extends DialogComponent {
  private emailConfigForm = this.emailConfigFormBuilder.group({
    cfg_id: ['', Validators.required],
    to_list: ['', Validators.required],
    cc_list: '',
    memo: "",
  });;
  private persons: any;
  private callback: any;

  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private emailConfigFormBuilder: FormBuilder,
    private emailSvc: EmailInfoService,
    private cmm: CommonService
  ) {
    super(layerRef, layer, layComp);
  }

  ngOnInit() {
    let obj = this;
    setTimeout(() => {
      if (obj.persons) {
        obj.emailConfigForm.patchValue(obj.persons);
      }
    });
  }

  private email_post(): void {
    if(this.cmm.isInvalidForm(this.emailConfigForm)) return;
    let obser;
    let obj = this;
    if (this.persons) {
      obser = this.emailSvc.updateEmail([assign(this.persons, this.emailConfigForm.value)]);
    } else {
      obser = this.emailSvc.createEmail([this.emailConfigForm.value]);
    }
    obser.subscribe(
      success => {
        window['esbLayer']({ type: 'alert', message: "保存成功！" });
        obj.callback && obj.callback();
        obj.close();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }
}
