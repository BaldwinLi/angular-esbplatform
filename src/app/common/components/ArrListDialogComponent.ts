import { Component, enableProdMode } from '@angular/core';
import { NgLayer, NgLayerRef } from "angular2-layer/angular2-layer";
import { DialogComponent } from "./DialogComponent";

//enable
enableProdMode();

@Component({
    selector: 'esb-arrlist-dialog',
    templateUrl: 'templates/arrlistdialog.html',
    providers: [NgLayer, NgLayerRef]
})
export class ArrListDialogComponent extends DialogComponent {
    private columns: Array<any>;
    private data: Array<any>;

    private tableConfig: any = {
        columns: [],
        data: []
    };

    ngOnInit() {
        let obj = this;
        setTimeout(() => {
            obj.tableConfig = {
                columns: obj.columns,
                data: obj.data
            };
        });
    }
}