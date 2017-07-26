import { Component } from '@angular/core';
import { startsWith } from 'lodash';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ROLE } from '../../../model/data-model';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "../../../common/components/DialogComponent";
import { UsersInfoService } from '../../../services/UsersInfoService';

@Component({
    selector: 'esb-mapping-dialog',
    templateUrl: 'templates/mappingConfigDialog.html'
})
export class MappingConfigDialogComponent extends DialogComponent {

    private mappingConfigForm;
    private persons: any = [];
    private roles: Array<any> = ROLE;
    private svcList: Array<any> = [];
    private callback: any;
    private svcNo: string = '';
    private allSvcData: Array<any> = [];
    private selectedLeftList: Array<any> = [];
    private selectedRightList: Array<any> = [];
    private allSvcTableConfig: any = {
        columns: [
            "$checkbox",
            {
                id: 'usr_svcno',
                header: "服务编号",
                type: 'text',
                width: '100'
            },
            {
                id: 'usr_svcname',
                header: "服务名称",
                type: 'text',
                width: '300'
            },
        ],
        data: []
    };
    private selectedSvcTableConfig: any = {
        columns: [
            "$checkbox",
            {
                id: 'usr_svcno',
                header: "服务编号",
                type: 'text',
                width: '100'
            },
            {
                id: 'usr_svcname',
                header: "服务名称",
                type: 'text',
                width: '300'
            },
        ],
        data: []
    };

    constructor(
        protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private userSvc: UsersInfoService,
        private mappingConfigFormBuilder: FormBuilder,
    ) {
        super(layerRef, layer, layComp);
    }

    // ngAfterViewChecked() {
    //     let obj = this;
    //     if (obj.selectedSvcTableConfig.data.length > 0) {
    //         this.allSvcTableConfig.data = this.allSvcTableConfig.data.filter(e => {
    //             for (let el of obj.selectedSvcTableConfig.data) {
    //                 if (el.usr_svcno == e.usr_svcno) return false;
    //             }
    //             return true;
    //         });
    //     }
    // }

    ngOnInit() {
        let obj = this;
        this.mappingConfigForm = this.mappingConfigFormBuilder.group({
            user_code: '',
            user_name: '',
            is_admin: 0
        });
        setTimeout(() => {
            if (obj.persons) {
                obj.mappingConfigForm = obj.mappingConfigFormBuilder.group({
                    user_code: obj.persons.user_code,
                    user_name: obj.persons.user_name,
                    is_admin: obj.persons.is_admin
                });
                obj.selectedSvcTableConfig.data = obj.persons.svclist || [];
            }
        });
        this.refreshData();
    }

    private addSvc(): void {
        if (this.selectedLeftList.length > 0) {
            let obj = this;
            this.selectedSvcTableConfig.data = this.selectedLeftList.concat(this.selectedSvcTableConfig.data);
            this.allSvcTableConfig.data = this.allSvcTableConfig.data.filter(e => {
                for (let el of obj.selectedLeftList) {
                    if (el.usr_svcno == e.usr_svcno) return false;
                }
                return true;
            });
            this.selectedRightList = this.selectedLeftList;
            this.selectedLeftList = [];
        }
    }

    private removeSvc(): void {
        if (this.selectedRightList.length > 0) {
            let obj = this;
            this.selectedSvcTableConfig.data = this.selectedSvcTableConfig.data.filter(e => {
                for (let el of obj.selectedRightList) {
                    if (el.usr_svcno == e.usr_svcno) return false;
                }
                return true;
            });
            this.allSvcTableConfig.data = this.selectedRightList.concat(this.allSvcTableConfig.data);
            this.selectedLeftList = this.selectedRightList;
            this.selectedRightList = [];
        }
    }

    private search(event): void {
        if (event && event.type == 'keypress' && event.charCode !== 13) return;
        if (!!this.svcNo) {
            let obj = this;
            this.allSvcTableConfig.data = this.allSvcData.filter(e => {
                return startsWith(e.usr_svcno.toLowerCase(), obj.svcNo.toLowerCase());
            });
        } else {
            this.allSvcTableConfig.data = this.allSvcData;
        }
    }

    private refreshData(): void {
        let obj = this;
        this.userSvc.queryUsersServices().subscribe(
            success => {
                obj.allSvcTableConfig.data = obj.allSvcData = (success.body && success.body.filter(e => {
                    for (let el of obj.selectedSvcTableConfig.data) {
                        if (el.usr_svcno == e.usr_svcno) return false;
                    }
                    return true;
                })) || [];
            },
            error => window['esbLayer']({ type: 'error', message: error })
        );
    }

    private user_post(): void {
        let obj = this;
        this.userSvc.updateUsersInfo_V2([{
            user: this.mappingConfigForm.value,
            svclist: this.selectedSvcTableConfig.data
        }]).subscribe(
            success => {
                window['esbLayer']({ type: 'alert', message: "授权成功！" });
                obj.callback && obj.callback();
                obj.close();
            },
            error => window['esbLayer']({ type: 'error', message: error })
            );
    }

    private getLeftSelectedItems(selectedItems: Array<any>): void {
        this.selectedLeftList = selectedItems;
    }

    private getRightSelectedItems(selectedItems: Array<any>): void {
        this.selectedRightList = selectedItems;
    }
}