import { Component, enableProdMode } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SVC_STATES, PATTERNS, IS_ENABLE, EVENT_LEVELS } from '../../../model/data-model';
import { CommonService } from '../../../services/common/CommonService';
import { EsbConfigsService } from '../../../services/EsbConfigsService';

@Component({
  selector: 'esb-service-dialog',
  templateUrl: 'templates/serviceConfigFormDialog.html',
  providers: [NgLayer, NgLayerRef]
})
export class ServiceConfigFormDialogComponent extends DialogComponent {

  private persons: any;
  private serviceConfigForm;
  private svc_states = SVC_STATES;
  private patterns = PATTERNS;
  private isEnable = IS_ENABLE;
  private event_levels = EVENT_LEVELS;
  private callback: any;
  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private serviceConfigFormBuilder: FormBuilder,
    private configSvc: EsbConfigsService
  ) {
    super(layerRef, layer, layComp);
  }

  ngAfterViewChecked() {
  }

  ngOnInit() {
    this.serviceConfigForm = this.serviceConfigFormBuilder.group({
          svc_no: '',
          svc_name: '',
          svc_id: '',
          project_name: '',
          svc_state: '',
          svc_desc: '',
          dest_protocol: '',
          dest_sys: '',
          src_protocol: '',
          src_sys: '',
          inner_code: '',
          pattern: '',
          log1: '',
          log2: '',
          log3: '',
          log4: '',
          esb_id: '',
          event_level: '',
          log_cnt: ''
        });
    setTimeout(() => {
      if (this.persons) {
        this.serviceConfigForm = this.serviceConfigFormBuilder.group(this.persons);
      }
    });
  }

  private esbconfigs_post(): void {
    let obser;
    let obj = this;
    if (this.persons) {
      obser = this.configSvc.updateEsbConfig(this.serviceConfigForm.value);
    } else {
      obser = this.configSvc.createEsbConfig(this.serviceConfigForm.value);
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