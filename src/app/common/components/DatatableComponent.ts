import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common/CommonService';
import { isString, isNumber, trim } from 'lodash';
import { ArrListDialogComponent } from './ArrListDialogComponent';

/**
 * 表格公共组件
 */
@Component({
    selector: 'datatable',
    templateUrl: 'templates/datatable.html'
})
export class DatatableComponent {

    constructor(private cmm: CommonService) {
        this.table_uuid = 'table_' + this.cmm.uuid;
    }

    private table_uuid: string;
    private isCheckAll;
    private sorted: boolean = false;
    private hasServerSort: boolean = false;
    private hasCheckbox: boolean;
    private hasRadio: boolean;
    private hasIndex: boolean;

    private checkRadioIndex: string = "0";

    private _resizableColumns: boolean = true;
    @Input() private set resizableColumns(isResizable: boolean){
        this._resizableColumns = isResizable;
    };
    @Input() private tableConfig: any = {
        columns: [],
        data: [],

    };

    @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() sortEmit: EventEmitter<any> = new EventEmitter<any>();

    private outputRows: Array<any>;
    private outputRow: Array<any>;

    private onMasterCheckbox(event?: any) {
        let obj = this;
        this.tableConfig.data = this.tableConfig.data.map((v) => {
            v.isChecked = obj.isCheckAll || false;
            return v;
        });

        this.outputRows = this.tableConfig.data.filter((e) => e.isChecked);
        this.selectedItems.emit(this.outputRows);
    }

    private onCheckbox(event: any) {
        this.outputRows = this.tableConfig.data.filter((e) => e.isChecked);
        this.selectedItems.emit(this.outputRows);
    }

    private onRadio(event: any) {
        let obj = this;
        this.outputRow = this.tableConfig.data.filter((e) => obj.checkRadioIndex == e.$index);
        this.selectedItems.emit(this.outputRow);
    }

    private sort(index, sortKey?: boolean): void {
        if (typeof sortKey !== 'undefined') this.tableConfig.columns[index].isDesc = sortKey;
        else this.tableConfig.columns[index].isDesc = !this.tableConfig.columns[index].isDesc;
        switch (this.tableConfig.columns[index].sort) {
            case 'server':
                this.sortEmit.emit(this.tableConfig.columns[index]);
                break;
            case 'int':
                this.tableConfig.data = this.tableConfig.data && this.tableConfig.data.sort((p, c) => {
                    if (isNumber(p[this.tableConfig.columns[index].id]) && isNumber(c[this.tableConfig.columns[index].id]))
                        return this.tableConfig.columns[index].isDesc ? (p[this.tableConfig.columns[index].id] - c[this.tableConfig.columns[index].id]) : (c[this.tableConfig.columns[index].id] - p[this.tableConfig.columns[index].id]);
                    else console.error('columns element type is not int.');
                });
                break;
            case 'string':
                this.tableConfig.data = this.tableConfig.data && this.tableConfig.data.sort((p, c) => {
                    if (isString(p[this.tableConfig.columns[index].id]) && isString(c[this.tableConfig.columns[index].id])) {
                        if (this.tableConfig.columns[index].isDesc)
                            return p[this.tableConfig.columns[index].id].localeCompare(c[this.tableConfig.columns[index].id]);
                        else
                            return c[this.tableConfig.columns[index].id].localeCompare(p[this.tableConfig.columns[index].id]);
                    } else console.error('columns element type is not string.');
                });
                break;
        }
    }

    private getArrToStr(data: Array<any>, displayField: string): string {
        let arrStr = '';
        for (let i in data) {
            if (i == '2') {
                arrStr += '...';
                break;
            }
            arrStr += (data[i][displayField] + ', ');
        }
        return trim(arrStr, ', ');
    }

    private openArrList(columns: Array<any>, data: Array<any>, title: string = '数据列表'): void {
        let dataObject = {
            columns,
            data
        }
        let dialog = window['esbLayer']({
            type: 'dialog',
            data: dataObject,
            dialogComponent: ArrListDialogComponent,
            title
        });
    }

    ngAfterViewChecked() {
        if (this.hasCheckbox) {
            this.isCheckAll = this.tableConfig.data.length > 0 ? this.tableConfig.data.every(e => e.isChecked) : false;
            this.tableConfig.data = this.tableConfig.data.map(v => {
                if (typeof v.isChecked === 'undefined')
                    v.isChecked = false;

                return v;
            });
            if (this.isCheckAll) this.onMasterCheckbox();

        }

        if (this.hasIndex) {
            this.tableConfig.data = this.tableConfig.data.map((v, i) => {
                if (typeof v.$index === 'undefined')
                    v.$index = i;

                return v;
            });
        }
    }

    ngOnChanges(changes: any) {
        let obj = this;
        this.hasServerSort = this.tableConfig.columns.some(e => e.sort == 'server');
        if (!!changes.tableConfig && !this.hasServerSort) {
            if (this.tableConfig.data && this.tableConfig.data.length > 0) {
                obj.sorted = false;
                this.tableConfig.columns = this.tableConfig.columns.map((e, i) => {
                    if (!!e.sort && !obj.sorted) {
                        e.isDesc = e.isDesc || false;
                        obj.sort(i, e.isDesc);
                        obj.sorted = true;
                    }
                    return e;
                });
            }
        }
    }

    ngOnInit() {
        let obj = this;
        this.hasCheckbox = this.tableConfig.columns.some(e => e === '$checkbox');
        this.hasRadio = this.tableConfig.columns.some(e => e === "$radio");
        this.hasIndex = this.tableConfig.columns.some(e => e === "$index");

        if (this.hasServerSort) {
            this.tableConfig.columns = this.tableConfig.columns.map((e, i) => {
                if (!!e.sort && e.sort === 'server' && e.defaultSort && !obj.sorted) {
                    e.isDesc = e.isDesc || false;
                    obj.sort(i, e.isDesc);
                    obj.sorted = true;
                }
                return e;
            });
        }
        if (this._resizableColumns) {
            setTimeout(() => {
                $("#" + obj.table_uuid)['resizableColumns']();
            });
        }


    }
}
