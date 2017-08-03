import { Component, enableProdMode } from '@angular/core';
import { NgLayer, NgLayerRef, NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "./DialogComponent";
import { CommonService } from '../../services/common/CommonService';

//enable
enableProdMode();

@Component({
    selector: 'esb-import-dialog',
    templateUrl: 'templates/importdialog.html',
    providers: [NgLayer, NgLayerRef]
})
export class ImportOperateDialogComponent extends DialogComponent {
    constructor(protected layerRef: NgLayerRef,
        protected layer: NgLayer,
        protected layComp: NgLayerComponent,
        private cmm: CommonService) {
        super(layerRef, layer, layComp);
    }
    private columns: Array<any>;
    private data: Array<any>;

    private uploadCallBack: Function;

    private tableConfig: any = {
        columns: [],
        data: []
    };

    private onImport(evt): void {
        let scope = this;
        this.cmm.onFileChange(evt, (data)=>{
            scope.tableConfig.data = data.map(v=>{
                let obj = {};
                for(let i in v){
                    if(scope.tableConfig.columns[i]) obj[scope.tableConfig.columns[i].id] = v[i];
                    else break;
                }
                return obj;
            });
        });
    }

    private upload(): void {
        this.uploadCallBack(this.tableConfig.data);
    }

    ngOnInit() {
        let scope = this;
        setTimeout(() => {
            if (scope.columns &&  scope.data)
                scope.tableConfig = {
                    columns: scope.columns,
                    data: scope.data
                };
        });
    }
}