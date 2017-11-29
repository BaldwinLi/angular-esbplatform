import { Component } from '@angular/core';
import { assign } from 'lodash';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SysContactsService } from '../../../services/SysContactsService';
import { SystemsService } from '../../../services/SystemsService';
import { CONTACT_TYPE } from '../../../model/data-model';
import { CommonService } from '../../../services/common/CommonService';


@Component({
  selector: 'esb-system-dialog',
  templateUrl: 'templates/systemConfigFormDialog.html'
})
export class SystemConfigFormDialogComponent extends DialogComponent {

  private persons: any;
  private contacts: any;
  private callback: any;
  private systemConfigForm = this.systemConfigFormBuilder.group({
    sys_name: ['', Validators.required],
    sys_no: ['_new', Validators.required],
    full_name: ['', Validators.required],
    memo: ''
  });
  private selectedData: Array<any> = [];
  private tableConfig: any = {
    primaryKey: 'contact_id',
    searchPlaceholder: '请输入邮箱进行查询',
    searchField: 'email',
    beSelectedTableTitle: '人员列表',
    selectedTableTitle: '已选人员',
    beSeletedDatatable: {
      columns: [
        "$checkbox",
        {
          id: 'name',
          header: "姓名",
          type: 'text',
          width: '100'
        },
        {
          id: 'email',
          header: "邮箱",
          type: 'text',
          width: '300'
        }
      ],
      data: []
    },
    seletedDatatable: {
      columns: [
        "$checkbox",
        {
          id: 'name',
          header: "姓名",
          type: 'text',
          width: '100'
        },
        {
          id: 'email',
          header: "邮箱",
          type: 'text',
          width: '300'
        },
        {
          id: 'contact_type',
          header: "联系人类型",
          type: 'input',
          inputType: 'select',
          options: CONTACT_TYPE
        }

      ],
      data: []
    },
    allData: []
  }

  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private systemConfigFormBuilder: FormBuilder,
    private contactSvc: SysContactsService,
    private sysSvc: SystemsService,
    private cmm: CommonService
  ) {
    super(layerRef, layer, layComp);
  }

  private refreshData(): void {
    let obj = this;
    this.contactSvc.querySysContact().subscribe(
      success => {
        let data = success.body && success.body.map(v => {
          v.contact_type = '1';
          return v;
        });
        obj.tableConfig = assign(obj.tableConfig, {
          allData: data || [],
          beSeletedDatatable: assign(obj.tableConfig.beSeletedDatatable, {
            data: data || []
          })
        });
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  private systems_post(): void {
    if (this.cmm.isInvalidForm(this.systemConfigForm)) return;
    let obser;
    let obj = this;
    if (this.persons) {
      obser = this.sysSvc.updateSystem(assign({contacts: this.selectedData.map(v=>({contact_id: v.contact_id, contact_type: v.contact_type}))}, this.systemConfigForm.value));
    } else {
      obser = this.sysSvc.createSystem(assign({contacts: this.selectedData.map(v=>({contact_id: v.contact_id, contact_type: v.contact_type}))}, this.systemConfigForm.value));
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
    let obj = this;
    setTimeout(() => {
      if (obj.persons) {
        obj.systemConfigForm.patchValue(obj.persons);
        obj.tableConfig.seletedDatatable.data = obj.persons.contacts || [];
      }
    });
    this.refreshData();
  }

  private setSelectedData(data: any): void {
    this.selectedData = data;
  }
}