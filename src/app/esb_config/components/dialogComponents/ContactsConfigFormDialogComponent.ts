import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SysContactsService } from '../../../services/SysContactsService';

@Component({
  selector: 'esb-contacts-dialog',
  templateUrl: 'templates/contactsConfigFormDialog.html'
})
export class ContactsConfigFormDialogComponent extends DialogComponent {
  private contactsConfigForm;
  private persons: any;
  private callback: any;

  constructor(
    protected layerRef:NgLayerRef, 
    protected layer:NgLayer, 
    protected layComp: NgLayerComponent, 
    private contactsConfigFormBuilder: FormBuilder,
    private contactSvc: SysContactsService
    ){
    super(layerRef, layer, layComp);
  }

  ngOnInit(){
    this.contactsConfigForm = this.contactsConfigFormBuilder.group({
      name: "",
      mobile: "",
      email: "",
      memo: "",
      company: ""
    });
    setTimeout(() => {
      if (this.persons) {
        this.contactsConfigForm = this.contactsConfigFormBuilder.group(this.persons);
      }
    });
  }

  private sys_contacts_post(): void {
    let obser;
    let obj = this;
    if (this.persons) {
      obser = this.contactSvc.updateSysContact(this.contactsConfigForm.value);
    } else {
      obser = this.contactSvc.createSysContact(this.contactsConfigForm.value);
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
