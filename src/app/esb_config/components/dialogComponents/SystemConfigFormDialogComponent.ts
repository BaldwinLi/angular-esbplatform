import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SystemsService } from '../../../services/SystemsService';
import { assign } from 'lodash';

@Component({
  selector: 'esb-system-dialog',
  templateUrl: 'templates/systemConfigFormDialog.html'
})
export class SystemConfigFormDialogComponent extends DialogComponent {

  private persons: any;
  private contacts: any;
  private callback: any;
  private systemConfigForm;

  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private systemConfigFormBuilder: FormBuilder,
    private sysSvc: SystemsService
  ) {
    super(layerRef, layer, layComp);
  }

  searchNo(per) { }

  searchNo1(per) { }

  private systems_post(): void {
    let obser;
    let obj = this;
    if (this.persons) {
      obser = this.sysSvc.updateSystem(this.systemConfigForm.value);
    } else {
      obser = this.sysSvc.createSystem(this.systemConfigForm.value);
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

  ngOnInit() {
    this.systemConfigForm = this.systemConfigFormBuilder.group({
      sys_name: '',
      sys_no: '',
      full_name: '',
      memo: '',
      contact_name: "",
      sub_contact_name: ""
    });
    setTimeout(() => {
      if (this.persons) {
        if(this.persons.contacts && this.persons.contacts[0]){
          this.persons.contact_name = this.persons.contacts[0].name;
        }
        if(this.persons.contacts && this.persons.contacts[1]){
          this.persons.sub_contact_name = this.persons.contacts[1].name;
        }
        this.contacts = this.persons.contacts
        delete this.persons.contacts
        this.systemConfigForm = this.systemConfigFormBuilder.group(this.persons);
      }
    });
  }
}