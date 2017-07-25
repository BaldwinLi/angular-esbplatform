import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SVC_STATES, AUTH_TYPES } from '../../../model/data-model';
import { MdmConsumersService } from '../../../services/MdmConsumersService';

@Component({
  selector: 'esb-mdm-dialog',
  templateUrl: 'templates/mdmConfigFormDialog.html'
})
export class MdmConfigFormDialogComponent extends DialogComponent {

  private persons: any;
  private svc_states = SVC_STATES;
  private auth_types = AUTH_TYPES;
  private mdmConfigForm;
  private callback: any;

  constructor(
    protected layerRef:NgLayerRef, 
    protected layer:NgLayer, 
    protected layComp: NgLayerComponent, 
    private mdmConfigFormBuilder: FormBuilder,
    private mdmSvc: MdmConsumersService
    ){
    super(layerRef, layer, layComp);
  }

  ngOnInit(){
    this.mdmConfigForm = this.mdmConfigFormBuilder.group({
      uuid: '',
      mdm_topic: '',
      consumer: '',
      svc_type: '',
      is_enabled: '',
      svc_version: '',
      auth_type: '',
      http_basic: '',
      oauth_token: '',
      user_agent: '',
      consumer_uri: ''
    });
    setTimeout(() => {
      if (this.persons) {
        this.mdmConfigForm = this.mdmConfigFormBuilder.group(this.persons);
      }
    });
  }
  
  private mdm_consumers_post(): void {
    let obser;
    let obj = this;
    if (this.persons) {
      obser = this.mdmSvc.updateMdmConsumer(this.mdmConfigForm.value);
    } else {
      obser = this.mdmSvc.createMdmConsumer(this.mdmConfigForm.value);
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