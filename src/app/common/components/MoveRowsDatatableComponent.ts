import { Component, Input, Output, EventEmitter } from '@angular/core';
import { startsWith } from 'lodash';

@Component({
    selector: 'esb-moverows-datatable',
    templateUrl: 'templates/moverowsdatatable.html'
})
export class MoveRowsDatatableComponent {

    private selectedLeftList: Array<any> = [];
    private selectedRightList: Array<any> = [];
    private searchValue: string = '';

    @Input() private config: any = {
        primaryKey: '',
        searchPlaceholder: '',
        searchField: '',
        beSelectedTableTitle: '',
        selectedTableTitle: '',
        beSeletedDatatable: {
            columns: [],
            data: []
        },
        seletedDatatable: {
            columns: [],
            data: []
        },
        allData: []
    }

    @Output() selectedData: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
        setTimeout(()=>{
            this.selectedData.emit(this.config.seletedDatatable.data);
        });
        
    }

    ngOnChanges(changes: any) { 
        if(changes.config) {
            this.selectedData.emit(changes.config['currentValue'].seletedDatatable.data);
        }
    }

    ngAfterViewChecked() {
        this.config.beSeletedDatatable.data = this.config.beSeletedDatatable.data.filter(e => {
            for (let el of this.config.seletedDatatable.data) {
                if (el[this.config.primaryKey] == e[this.config.primaryKey]) return false;
            }
            return true;
        });
    }

    private addSvc(): void {
        if (this.selectedLeftList.length > 0) {
            let obj = this;
            this.config.seletedDatatable.data = this.selectedLeftList.concat(this.config.seletedDatatable.data);
            this.selectedRightList = this.selectedLeftList.concat(this.selectedRightList);
            this.selectedLeftList = [];
            this.selectedData.emit(this.config.seletedDatatable.data);
        }
    }

    private removeSvc(): void {
        if (this.selectedRightList.length > 0) {
            let obj = this;
            this.config.seletedDatatable.data = this.config.seletedDatatable.data.filter(e=>{
                for (let el of obj.selectedRightList) {
                    if (el[this.config.primaryKey] == e[this.config.primaryKey]) return false;
                }
                return true;
            })
            this.config.beSeletedDatatable.data = this.selectedRightList.concat(this.config.beSeletedDatatable.data);
            this.selectedLeftList = this.selectedRightList.concat(this.selectedLeftList);
            this.selectedRightList = [];
            this.selectedData.emit(this.config.seletedDatatable.data);
        }
    }

    private search(event): void {
        if (event && event.type == 'keypress' && event.charCode !== 13) return;
        if (!!this.config.searchField && !!this.searchValue) {
            let obj = this;
            this.config.beSeletedDatatable.data = this.config.allData.filter(e => {
                return e[this.config.searchField].toLowerCase().indexOf(obj.searchValue.toLowerCase())>-1;
            });
        } else {
            this.config.beSeletedDatatable.data = this.config.allData.filter(e => {
                for (let el of this.config.seletedDatatable.data) {
                    if (el[this.config.primaryKey] == e[this.config.primaryKey]) return false;
                }
                return true;
            });
        }
    }

    private getLeftSelectedItems(selectedItems: Array<any>): void {
        this.selectedLeftList = selectedItems;
    }

    private getRightSelectedItems(selectedItems: Array<any>): void {
        this.selectedRightList = selectedItems;
    }
}