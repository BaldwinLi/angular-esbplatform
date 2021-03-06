import { Component, enableProdMode } from '@angular/core';
import { endsWith } from 'lodash';
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
        if (!!window['ActiveXObject'] || "ActiveXObject" in window) {
            window['esbLayer']({ type: 'alert', message: "IE浏览器不支持Excel数据读取功能，请更换其他浏览器进行操作。" });
            this.close();
            return;
        }
    }
    private filePath: string = '';
    private columns: Array<any>;
    private data: Array<any>;

    private uploadCallBack: Function;

    private tableConfig: any = {
        columns: [],
        data: []
    };

    private onImport(evt): void {
        if (evt.target.files.length === 0) {
            this.tableConfig.data = [];
            this.filePath = '';
            return;
        }
        if (!endsWith(evt.target.files[0].name, '.xls') && !endsWith(evt.target.files[0].name, '.xlsx')) {
            window['esbLayer']({ type: 'alert', message: "请导入XLS或XLSX格式文件。" });
            return;
        }
        let scope = this;
        this.filePath = evt.target.value;
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
        // if (!!window['ActiveXObject'] || "ActiveXObject" in window) {
        //     window['esbLayer']({ type: 'alert', message: "IE浏览器不支持Excel数据读取功能，请更换其他浏览器进行操作。" });
        //     this.close();
        //     return;
        // }
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