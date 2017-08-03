import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysContactsService } from '../../../services/SysContactsService';

@Component({
  selector: 'esb-contacts-dialog',
  templateUrl: 'templates/contactsConfigFormDialog.html'
})
export class ContactsConfigFormDialogComponent extends DialogComponent {
  private contactsConfigForm = this.contactsConfigFormBuilder.group({
    name: ['', Validators.required],
    mobile: ['', Validators.required],
    email: ['', Validators.required],
    memo: "",
    company: ""
  });;
  private persons: any;
  private callback: any;

  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private contactsConfigFormBuilder: FormBuilder,
    private contactSvc: SysContactsService
  ) {
    super(layerRef, layer, layComp);
  }

  ngOnInit() {
    let obj = this;
    setTimeout(() => {
      if (obj.persons) {
        obj.contactsConfigForm.patchValue(obj.persons);
      }
    });
  }

  private sys_contacts_post(): void {
    if(this.contactsConfigForm.status == 'INVALID') return;
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
