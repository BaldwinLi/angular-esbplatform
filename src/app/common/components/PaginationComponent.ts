import { Component, Input, Output, EventEmitter } from '@angular/core';
import { isNumber } from 'lodash';


@Component({
  selector: 'esb-pagination',
  templateUrl: 'templates/pagination.html'
})
export class PaginationComponent {

  @Input() private totalRows = 0;
  private pages: Array<number> = [1, 2, 3, 4, 5];
  @Input() private pageNow: number = 1;
  @Input() private pageTol: number = 10;
  private totalPages: number = 0;

  private focusStyle = {};

  private rowsCountDisplay: number;
  @Output() outputPageNow: EventEmitter<number> = new EventEmitter<number>();
  @Output() outputPageTol: EventEmitter<number> = new EventEmitter<number>();

  ngOnChanges(changes: any) {
    if(typeof changes.totalRows !== 'undefined' && !!changes.totalRows.previousValue){
      this.pageNow = 1;
      this.pageTol = 10;
      this.outputPageNow.emit(typeof this.pageNow == "string" ? parseInt(this.pageNow) : this.pageNow);
      this.outputPageTol.emit(typeof this.pageTol == "string" ? parseInt(this.pageTol) : this.pageTol);
    }
    this.totalPages = (this.totalRows % this.pageTol > 0) ? (Math.floor(this.totalRows / this.pageTol) + 1) : (this.totalRows / this.pageTol);
  }

  ngAfterViewChecked() {
  // ngOnChanges(changes: any) {
    if (this.totalRows == 0) {
      this.pageTol = 0;
      this.pageNow = 0;
      this.totalPages = 0;
      this.pages = [];
      return;
    }
    if (typeof this.pageNow === 'string' && this.pageNow === '') return;
    if (typeof this.pageTol === 'string' && this.pageTol === '') return;
    if (typeof this.pageNow === 'string' && this.pageNow !== '') {
      if (!isNaN(parseInt(this.pageNow))) this.pageNow = parseInt(this.pageNow);
      else this.pageNow = 1;
    }
    if (typeof this.pageTol === 'string' && this.pageTol !== '') {
      if (!isNaN(parseInt(this.pageTol))) this.pageTol = parseInt(this.pageTol);
      else this.pageTol = 10;
    }
    if (typeof this.totalRows === 'string' && this.totalRows !== '') {
      if (!isNaN(parseInt(this.totalRows))) this.totalRows = parseInt(this.totalRows);
      else return;
    }
    if (this.pageTol == 0) this.pageTol = 10;
    if (this.pageTol > this.totalRows) {
      this.pageTol = this.totalRows;
      // this.outputPageTol.emit(typeof this.pageTol == "string" ? parseInt(this.pageTol) : this.pageTol);
    }
    if (this.pageNow <= 0) this.pageNow = 1;
    if (this.pageNow > this.totalPages) this.pageNow = this.totalPages;

    if (this.pageTol > 0)
      this.totalPages = (this.totalRows % this.pageTol > 0) ? (Math.floor(this.totalRows / this.pageTol) + 1) : (this.totalRows / this.pageTol);

    if (this.totalPages >= 5 && this.pageNow > 3 && this.pageNow < (this.totalPages - 2)) {
      this.pages = [this.pageNow - 2, this.pageNow - 1, this.pageNow, this.pageNow + 1, this.pageNow + 2];
    } else if (this.totalPages >= 5 && this.pageNow <= 3) {
      this.pages = [1, 2, 3, 4, 5];
    } else if (this.totalPages >= 5 && this.pageNow >= (this.totalPages - 2)) {
      this.pages = [this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages];
    } else if (this.totalPages < 5) {
      this.pages = [];
      for (let i = 0; i < this.totalPages; i++) {
        this.pages.push(i + 1);
      }
    }

  }

  private upPage(): void {
    if (this.pageNow <= 1) return;
    this.pageNow -= 1;
    this.getPage(this.pageNow);
  }

  private getPage(page: number): void {
    this.pageNow = page;
    this.outputPageNow.emit(typeof this.pageNow == "string" ? parseInt(this.pageNow) : this.pageNow);
  }

  private downPage(): void {
    if (this.pageNow >= this.totalPages) return;
    this.pageNow += 1;
    this.getPage(this.pageNow);
  }

  private changePage(event): void {
    if (!isNumber(this.pageNow)) this.pageNow = 1;
    this.getPage(this.pageNow);
  }

  private changePageTol(event): void {
    if (!isNumber(this.pageTol)) this.pageTol = 10;
    this.totalPages = (this.totalRows % this.pageTol > 0) ? (Math.floor(this.totalRows / this.pageTol) + 1) : (this.totalRows / this.pageTol);
    this.outputPageTol.emit(typeof this.pageTol == "string" ? parseInt(this.pageTol) : this.pageTol);
  }

}
