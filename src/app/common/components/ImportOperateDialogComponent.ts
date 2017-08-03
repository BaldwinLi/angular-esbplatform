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
        this.cmm.onFileChange(evt, (data) => {
            scope.tableConfig.data = data.map(v => {
                let obj = {};
                for (let i in v) {
                    if (scope.tableConfig.columns[i]) obj[scope.tableConfig.columns[i].id] = v[i];
                    else break;
                }
                return obj;
            });
        });
    }

    private upload(): void {
        let invalid = false;
        let scope = this;
        for (let i in this.tableConfig.data) {
            this.tableConfig.columns.forEach(e => {
                if (e.rules) {
                    e.rules.forEach(rule => {
                        switch (rule) {
                            case 'required':
                                if (!scope.tableConfig.data[i][e.id] && scope.tableConfig.data[i][e.id] !== 0) {
                                    invalid = true;
                                    scope.tableConfig.data[i].class = 'invalid_field';
                                }
                                break;
                            case 'email':
                                if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(scope.tableConfig.data[i][e.id]))) {
                                    invalid = true;
                                    scope.tableConfig.data[i].class = 'invalid_field';
                                }
                                break;
                            case 'pattern':
                                if (!e.pattern) {
                                    console.error('Pattern can not be undefined with pattern rule.');
                                    break;
                                }
                                if (!(e.pattern.test(scope.tableConfig.data[i][e.id]))) {
                                    invalid = true;
                                    scope.tableConfig.data[i].class = 'invalid_field';
                                }
                                break;
                            case 'maxLength':
                                if (!e.maxLength) {
                                    console.error('maxLength can not be undefined with maxLength rule.');
                                    break;
                                }
                                if (!(scope.tableConfig.data[i][e.id].length <= e.maxLength)) {
                                    invalid = true;
                                    scope.tableConfig.data[i].class = 'invalid_field';
                                }
                                break;
                            case 'minLength':
                                if (!e.minLength) {
                                    console.error('minLength can not be undefined with minLength rule.');
                                    break;
                                }
                                if (!(scope.tableConfig.data[i][e.id].length >= e.minLength)) {
                                    invalid = true;
                                    scope.tableConfig.data[i].class = 'invalid_field';
                                }
                                break;
                            default:
                                return;
                        }
                    });
                }
            });
        }
        this.uploadCallBack(this.tableConfig.data, invalid);
    }

    ngOnInit() {
        let scope = this;
        setTimeout(() => {
            if (scope.columns && scope.data)
                scope.tableConfig = {
                    columns: scope.columns,
                    data: scope.data
                };
        });
    }
}