import { Component } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SVC_STATES, AUTH_TYPES } from '../../../model/data-model';
import { CommonService } from '../../../services/common/CommonService';
import { MdmConsumersService } from '../../../services/MdmConsumersService';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'esb-mdm-dialog',
  templateUrl: 'templates/mdmConfigFormDialog.html',
  animations: [
    trigger('shrink', [
      // state('in', style({height: '*'})),
      // state('out', style({height: '*'})),
      transition('* => void', [
        style({ height: '*' }),
        animate(150, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate(150, style({ height: '*' }))
      ])
    ])
  ]
})
export class MdmConfigFormDialogComponent extends DialogComponent {

  private usr_svcno: string;
  private persons: any = [];
  private svc_states = SVC_STATES;
  private auth_types = AUTH_TYPES;
  private mdmConfigForm = this.mdmConfigFormBuilder.group({
    uuid: '',
    mdm_topic: ['', Validators.required],
    consumer: ['', Validators.required],
    svc_type: ['', Validators.required],
    is_enabled: ['1', Validators.required],
    svc_version: ['', Validators.required],
    auth_type: ['0', Validators.required],
    http_basic: '',
    oauth_token: '',
    user_agent: '',
    consumer_uri: ['', Validators.required]
  });
  private callback: any;
  private formVisable: boolean = false;
  private searchFieldsConfig: any = {
    fields: ''
  };
  private tableConfig: any = {
    columns: [
      {
        id: 'uuid',
        header: "ID",
        type: 'text'
      },
      {
        id: 'mdm_topic',
        header: "主题",
        type: 'text'
      },
      {
        id: 'consumer',
        header: "消费者",
        type: 'text'
      },
      {
        id: 'consumer_uri',
        header: "URL",
        type: 'text',
        displayField: "name"
      },
      {
        id: 'auth_type',
        header: "服务类型",
        type: 'mapping',
        // inputType: 'select',
        options: 'AUTH_TYPES',
        width: '220'
      },
      {
        id: 'is_enabled',
        header: "服务状态",
        type: 'mapping',
        // inputType: 'select',
        options: 'SVC_STATES',
        width: '70'
      },
      {
        id: 'svc_version',
        header: "订阅版本",
        type: 'text'
        // inputType: 'text'
      },
      {
        header: "修改",
        type: 'template',
        width: '50',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            return "<i class='business_edits_icon'></i>"
          },
          on: {
            click: this.showForm.bind(this)
          }
        }
      },
      {
        header: "删除",
        type: 'template',
        width: '50',
        template: {
          type: "html",
          tempBuilder: function (row, headers) {
            return "<i class='delete_icon'></i>"
          },
          on: {
            click: this.business_delete.bind(this)
          }
        }
      }
    ],
    data: this.persons,
    isStaticPagination: true
  };


  constructor(
    protected layerRef: NgLayerRef,
    protected layer: NgLayer,
    protected layComp: NgLayerComponent,
    private mdmConfigFormBuilder: FormBuilder,
    private cmm: CommonService,
    private mdmSvc: MdmConsumersService
  ) {
    super(layerRef, layer, layComp);
  }



  private showForm(row: any): void {
    this.formVisable = true;
    if (!!row) this.mdmConfigForm.patchValue(row);
    else {
      this.mdmConfigForm.reset({
        uuid: '',
        mdm_topic: '',
        consumer: '',
        svc_type: '',
        is_enabled: '1',
        svc_version: '',
        auth_type: '0',
        http_basic: '',
        oauth_token: '',
        user_agent: '',
        consumer_uri: ''
      });
    }
  }

  private hideForm(): void {
    this.formVisable = false;
  }

  private business_delete(row: any): void {
    let obj = this;
    let confirmLayer = window['esbLayer']({ type: 'confirm', message: "是否确认删除？" }).ok(
      () => {
        obj.mdmSvc.deleteMdmConsumer(row.uuid).subscribe(
          success => {
            window['esbLayer']({ type: 'alert', message: "删除成功！" });
            obj.refreshData();
          },
          error => window['esbLayer']({ type: 'error', message: error })
        );
        confirmLayer.close();
      }
    );
  }

  private refreshData(): void {
    let obj = this;
    this.mdmSvc.queryMdmConsumersList(this.usr_svcno).subscribe(
      success => {
        obj.persons = success.body || [];
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }

  ngOnInit() {
    let obj = this;
    setTimeout(() => {
      if (obj.usr_svcno) {
        obj.refreshData()
      }
    });
  }

  private mdm_consumers_post(): void {
    if(this.cmm.isInvalidForm(this.mdmConfigForm)) return;
    let obser;
    let obj = this;
    if (!!this.mdmConfigForm.value['uuid']) {
      obser = this.mdmSvc.updateMdmConsumer(this.mdmConfigForm.value);
    } else {
      obser = this.mdmSvc.createMdmConsumer(this.mdmConfigForm.value);
    }
    obser.subscribe(
      success => {
        window['esbLayer']({ type: 'alert', message: "保存成功！" });
        obj.refreshData();
        obj.hideForm();
      },
      error => window['esbLayer']({ type: 'error', message: error })
    );
  }
}