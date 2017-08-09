import { Component, enableProdMode } from '@angular/core';
import { NgLayer, NgLayerRef } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";

//enable
enableProdMode();

@Component({
    selector: 'esb-services-dialog',
    templateUrl: 'templates/servicesListDialog.html',
    providers: [NgLayer, NgLayerRef]
})
export class ServicesListDialogComponent extends DialogComponent {
    private errors: Array<any> = [];

    private okCallback;

    private tableConfig: any = {
        columns: [
            {
                id: 'err_id',
                header: "错误ID",
                type: 'text',
                width: '60'
            },
            {
                id: 'service_name',
                header: "服务名",
                type: 'text',
                width: '400'
            },
            {
                id: 'err_type_code',
                header: "故障类别",
                type: 'text',
                width: '100'
            },
            {
                id: 'err_msg',
                header: "故障信息",
                type: 'text',
                width: '100'
            },
            {
                id: "err_status",
                header: "错误状态",
                type: 'mapping',
                options: 'SGM_ESBMON_ERRSTATUS',
                width: '80'
            },
            {
                id: "err_level",
                header: "故障严重性",
                type: 'mapping',
                options: 'EVENT_LEVELS',
                width: '110'
            }
        ],
        data: [],
        isStaticPagination: true
    };

    ok() {
        this.okCallback(this.errors);
        this.layComp.close();
    }

    // ngAfterViewChecked() {
    //     this.tableConfig.data = this.errors;
    // }

}