import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common/CommonService';
import { isString, isNumber, trim, isObject } from 'lodash';

@Component({
    selector: 'flex-datatable',
    templateUrl: 'templates/flexdatatable.html',
})
export class FlexDatatableComponent {
    constructor(private cmm: CommonService) { }
    private dataArr: Array<any> = [];
    private cache: Array<any> = [];
    @Input() staticSearchFieldsConfig: any = {
        fields: {}
    };
    private _resizableColumns: boolean = true;
    @Input() private set resizableColumns(isResizable: boolean) {
        this._resizableColumns = isResizable;
    };
    @Input() private config: any = {
        columns: [],
        data: []
    };
    @Input() tableData: Array<any> = [];
    @Input() private totalRows = 0;
    @Input() private pageNow: number = 1;
    @Input() private pageTol: number = 10;
    @Output() private sortEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() private selectedItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() private outputPageNow: EventEmitter<number> = new EventEmitter<number>();
    @Output() private outputPageTol: EventEmitter<number> = new EventEmitter<number>();

    private getSort(column: any): void {
        if (!!this.config.isStaticPagination && column.sort != 'server' && this.dataArr.length > 0) {
            switch (column.sort) {
                case 'int':
                    this.dataArr = this.dataArr.sort((p, c) => {
                        if (isNumber(p[column.id]) && isNumber(c[column.id]))
                            return column.isDesc ? (p[column.id] - c[column.id]) : (c[column.id] - p[column.id]);
                        else console.error('columns element type is not int.');
                    });
                    break;
                case 'string':
                    this.dataArr = this.dataArr.sort((p, c) => {
                        if (isString(p[column.id]) && isString(c[column.id])) {
                            if (column.isDesc)
                                return p[column.id].localeCompare(c[column.id]);
                            else
                                return c[column.id].localeCompare(p[column.id]);
                        } else console.error('columns element type is not string.');
                    });
                    break;
            }
        } else {
            this.sortEmit.emit(column);
        }
    }
    private getSelectedItem(row: any): void {
        this.selectedItem.emit(row);
    }
    private getSelectedItems(rows: any): void {
        this.selectedItems.emit(rows);
    }
    private getPageNow(page: number): void {
        if (!!this.config.isStaticPagination) {
            this.pageNow = page;
        } else this.outputPageNow.emit(page);

    }
    private getPageTol(count: number): void {
        if (!!this.config.isStaticPagination) {
            this.pageTol = count;
        } else this.outputPageTol.emit(count);
    }

    private refreshPageData(): void {
        let scope = this;
        this.cache = this.dataArr.filter(e => {
            if (Object.keys(scope.staticSearchFieldsConfig.fields).length > 0) {
                let isMatch;
                if (isString(scope.staticSearchFieldsConfig.fields)) {
                    isMatch = false;
                    for (let i in e) {
                        if (typeof e[i] === 'undefined' || isObject(e[i])) continue;
                        if (!scope.staticSearchFieldsConfig.fields || (!!e[i] && e[i].toString().toLowerCase().indexOf(scope.staticSearchFieldsConfig.fields.toString().toLowerCase()) > -1)) isMatch = true;
                    }
                } else {
                    isMatch = true;
                    for (let i in scope.staticSearchFieldsConfig.fields) {
                        if (typeof e[i] === 'undefined' || isObject(e[i])) continue;
                        if (!!scope.staticSearchFieldsConfig.fields[i] && !!e[i] && e[i].toString().toLowerCase().indexOf(scope.staticSearchFieldsConfig.fields[i].toString().toLowerCase()) == -1) isMatch = false;
                    }
                }
                return isMatch;
            }
            return true;
        });
        let tableDataInfo = this.cmm.getPageData(this.cache || this.dataArr, this.pageNow, this.pageTol);
        this.totalRows = tableDataInfo.rowsCount;
        this.config.data = tableDataInfo.currentPageRows
    }
    ngAfterViewChecked() {
        if (!!this.config.isStaticPagination && this.dataArr.length > 0) {
            this.refreshPageData();
        }
    }
    ngOnChanges(changes: any) {
        if (changes.tableData) {
            this.dataArr = new Array(...changes.tableData.currentValue) || [];
        }
    }

    ngOnInit() {

    }
}