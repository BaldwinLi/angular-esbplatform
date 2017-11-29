import { Component, enableProdMode } from '@angular/core';
import { startsWith } from 'lodash';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SVC_STATES, PATTERNS, IS_ENABLE, EVENT_LEVELS, SVC_TYPE, SGM_ESB_PROTOCOLS, SVC_CATEGORY } from '../../../model/data-model';
import { CommonService } from '../../../services/common/CommonService';
import { EsbConfigsService } from '../../../services/EsbConfigsService';
import { SysContactsService } from '../../../services/SysContactsService';

@Component({
  selector: 'esb-service-dialog',
  templateUrl: 'templates/serviceConfigFormDialog.html',
  providers: [NgLayer, NgLayerRef]
})
export class ServiceConfigFormDialogComponent extends DialogComponent {

  private persons: any;
  private svcNoCache: any = {
    S: '',
    I: '',
    D: '',
    C: ''
  };
  private sysCache: any = {
    dest: '',
    src: ''
  };
  private sysList: Array<any> = [];
  private serviceConfigForm = this.serviceConfigFormBuilder.group({
    svc_category: ['I', Validators.required],
    svc_no: ['', Validators.required],
    svc_name: '',
    svc_id: '',
    project_name: ['', Validators.required],
    svc_state: ['1', Validators.required],
    svc_type: ['C', Validators.required],
    svc_desc: '',
    dest_protocol: ['REST', Validators.required],
    dest_sys: ['', Validators.required],
    // dest_sys_fullname: '',
    src_protocol: ['REST', Validators.required],
    src_sys: ['', Validators.required],
    // src_sys_fullname: '',
    // inner_code: ['', Validators.required],
    pattern: ['', Validators.required],
    log1: ['1', Validators.required],
    log2: ['1', Validators.required],
    log3: ['1', Validators.required],
    log4: ['1', Validators.required],
    esb_id: ['', Validators.required],
    event_level: ['1', Validators.required]
  });
  private svc_states = SVC_STATES;
  private patterns = PATTERNS;
  private isEnable = IS_ENABLE;
  private event_levels = EVENT_LEVELS;
  private svc_types = SVC_TYPE;
  private protocols = SGM_ESB_PROTOCOLS;
  private svc_category = SVC_CATEGORY;
  private callback: any;
  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private serviceConfigFormBuilder: FormBuilder,
    private configSvc: EsbConfigsService,
    private cmm: CommonService,
    private sysContactSvc: SysContactsService
  ) {
    super(layerRef, layer, layComp);
  }

  ngAfterViewChecked() {
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.persons) {
        this.serviceConfigForm.patchValue(this.persons);
        if (startsWith(this.persons['svc_no'], 'S')) {
          this.svcNoCache['S'] = this.persons['svc_no'];
          this.serviceConfigForm.patchValue({ svc_category: 'S' });
        } else if (startsWith(this.persons['svc_no'], 'C')) {
          this.svcNoCache['C'] = this.persons['svc_no'];
          this.serviceConfigForm.patchValue({ svc_category: 'C' });
        } else if (startsWith(this.persons['svc_no'], 'D')) {
          this.svcNoCache['D'] = this.persons['svc_no'];
          this.serviceConfigForm.patchValue({ svc_category: 'D' });
        } else if (startsWith(this.persons['svc_no'], 'I')) this.svcNoCache['I'] = this.persons['svc_no'];
      }
    });
    this.setSysList();
  }

  private esbconfigs_post(): void {
    if (this.cmm.isInvalidForm(this.serviceConfigForm)) return;
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

  private setServiceName(): void {
    if (!this.serviceConfigForm.value['svc_no'] && !this.serviceConfigForm.value['project_name']) this.serviceConfigForm.patchValue({ svc_name: '' });
    else this.serviceConfigForm.patchValue({ svc_name: (this.serviceConfigForm.value['svc_no'] || '') + '_' + (this.serviceConfigForm.value['project_name'] || '') });
  }

  private setSvcNo(): void {
    const key = this.serviceConfigForm.value['svc_category'];
    switch (key) {
      case 'I':
        if (!!this.svcNoCache['I']) {
          this.serviceConfigForm.patchValue({ svc_no: this.svcNoCache['I'] });
          this.setServiceName();
        } else {
          this.retrieveSvcNo('I');
        }
        break;
      case 'S':
        if (!!this.svcNoCache['S']) {
          this.serviceConfigForm.patchValue({ svc_no: this.svcNoCache['S'] });
          this.setServiceName();
        } else {
          this.retrieveSvcNo('S');
        }
        break;
      case 'C':
        if (!!this.svcNoCache['C']) {
          this.serviceConfigForm.patchValue({ svc_no: this.svcNoCache['C'] });
          this.setServiceName();
        } else {
          this.retrieveSvcNo('C');
        }
        break;
      case 'D':
        if (!!this.svcNoCache['D']) {
          this.serviceConfigForm.patchValue({ svc_no: this.svcNoCache['D'] });
          this.setServiceName();
        } else {
          this.retrieveSvcNo('D');
        }
        break;
    }
  }

  private retrieveSvcNo(type: string): void {
    let obj = this;
    this.configSvc.retrieveSvcNewNo(type).subscribe(
      success => {
        obj.serviceConfigForm.patchValue({ svc_no: obj.svcNoCache[type] = success.body['svcno'] || '' });
        obj.setServiceName();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  private setSysList(): void {
    let obj = this;
    this.sysContactSvc.querySystemsAndContactsList().subscribe(
      success => {
        obj.sysList = success.body && success.body.map(v => ({
          sys_name: v.sys_name
          // full_name: v.full_name
        })) || [];
        // obj.serviceConfigForm.patchValue({
        //   dest_sys_fullname: obj.getDestSysName,
        //   src_sys_fullname: obj.getSrcSysName
        // });
        obj.sysCache.dest = obj.getDestSysName;
        obj.sysCache.src = obj.getSrcSysName;
        obj.setSvcNo();
      }
    );
  }

  private setDestSys(obj: any): void {
    if (obj && obj.constructor.name !== 'FocusEvent') {
      this.serviceConfigForm.patchValue({
        dest_sys: obj.sys_name
        // dest_sys_fullname: obj.full_name
      });
    } else {
      if (!!obj) {
        if (!this.serviceConfigForm.value.dest_sys) this.serviceConfigForm.controls['dest_sys'].markAsTouched();
        if (this.serviceConfigForm.value.dest_sys === obj.target.value) return;
        this.sysCache.dest = obj.target.value;
      } else {
        this.sysCache.dest = this.getDestSysName;
      }
    }
  }

  private setSrcSys(obj: any): void {
    if (obj && obj.constructor.name !== 'FocusEvent') {
      this.serviceConfigForm.patchValue({
        src_sys: obj.sys_name
        // src_sys_fullname: obj.full_name
      });
    } else {
      if (!!obj) {
        if (!this.serviceConfigForm.value.src_sys) this.serviceConfigForm.controls['src_sys'].markAsTouched();
        if (this.serviceConfigForm.value.src_sys === obj.target.value) return;
        this.sysCache.src = obj.target.value;
      } else {
        this.sysCache.src = this.getSrcSysName;
      }
    }
  }

  private get getDestSysName(): string {
    for (let e of this.sysList) {
      if (e['sys_name'] == this.serviceConfigForm.value['dest_sys']) {
        return e.sys_name;
      }
    }
    return ''
  }

  private get getSrcSysName(): string {
    for (let e of this.sysList) {
      if (e['sys_name'] == this.serviceConfigForm.value['src_sys']) {
        return e.sys_name;
      }
    }
    return ''
  }

  private get getDestComboClass(): string {
    if (this.serviceConfigForm.get('dest_sys').errors && (this.serviceConfigForm.get('dest_sys').dirty || this.serviceConfigForm.get('dest_sys').touched))
      return 'form-control input_invalid_combo';
    else return 'form-control input_combo';
  }

  private get getSrcComboClass(): string {
    if (this.serviceConfigForm.get('src_sys').errors && (this.serviceConfigForm.get('src_sys').dirty || this.serviceConfigForm.get('src_sys').touched))
      return 'form-control input_invalid_combo';
    else return 'form-control input_combo';
  }
}