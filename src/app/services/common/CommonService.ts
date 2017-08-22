import { Injectable } from '@angular/core';
import { padStart, isObject, isArray } from 'lodash';
import { saveAs } from 'file-saver';

type AOA = Array<Array<any>>;

function s2ab(s: string): ArrayBuffer {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  };
  return buf;
}

@Injectable()
export class CommonService {

  constructor() { }

  data: AOA = [[], []];
  wopts: any = { bookType: 'xlsx', type: 'binary' };
  fileName: string = "SheetJS.xlsx";

  private preTimeTamps: Array<String> = [];

  get getEsblastThreeDaysTimeStr(): string {
    let date: Date = new Date();
    date.setDate(date.getDate() - 3);
    let year = date.getFullYear().toString();
    let month_cache = date.getMonth() + 1;
    let month = month_cache < 10 ? padStart(month_cache.toString(), 2, '0') : month_cache.toString();
    let day_cache = date.getDate();
    let day = day_cache < 10 ? padStart(day_cache.toString(), 2, '0') : day_cache.toString();
    let hour_cache = date.getHours();
    let hour = hour_cache < 10 ? padStart(hour_cache.toString(), 2, '0') : hour_cache.toString();
    let minute_cache = date.getMinutes();
    let minute = minute_cache < 10 ? padStart(minute_cache.toString(), 2, '0') : minute_cache.toString();
    let second_cache = date.getSeconds();
    let second = second_cache < 10 ? padStart(second_cache.toString(), 2, '0') : second_cache.toString();
    return year + month + day + hour + minute + second;
  }

  get getEsblastThreeMonthsTimeStr(): string {
    let date: Date = new Date();
    date.setMonth(date.getMonth() - 3);
    let year = date.getFullYear().toString();
    let month_cache = date.getMonth() + 1;
    let month = month_cache < 10 ? padStart(month_cache.toString(), 2, '0') : month_cache.toString();
    let day_cache = date.getDate();
    let day = day_cache < 10 ? padStart(day_cache.toString(), 2, '0') : day_cache.toString();
    let hour_cache = date.getHours();
    let hour = hour_cache < 10 ? padStart(hour_cache.toString(), 2, '0') : hour_cache.toString();
    let minute_cache = date.getMinutes();
    let minute = minute_cache < 10 ? padStart(minute_cache.toString(), 2, '0') : minute_cache.toString();
    let second_cache = date.getSeconds();
    let second = second_cache < 10 ? padStart(second_cache.toString(), 2, '0') : second_cache.toString();
    return year + month + day + hour + minute + second;
  }

  get getEsbCurrentTimeStr(): string {
    let date = new Date();
    let year = date.getFullYear().toString();
    let month_cache = date.getMonth() + 1;
    let month = month_cache < 10 ? padStart(month_cache.toString(), 2, '0') : month_cache.toString();
    let day_cache = date.getDate();
    let day = day_cache < 10 ? padStart(day_cache.toString(), 2, '0') : day_cache.toString();
    let hour_cache = date.getHours();
    let hour = hour_cache < 10 ? padStart(hour_cache.toString(), 2, '0') : hour_cache.toString();
    let minute_cache = date.getMinutes();
    let minute = minute_cache < 10 ? padStart(minute_cache.toString(), 2, '0') : minute_cache.toString();
    let second_cache = date.getSeconds();
    let second = second_cache < 10 ? padStart(second_cache.toString(), 2, '0') : second_cache.toString();
    return year + month + day + hour + minute + second;
  }

  getFormatToDate(date: string): string {
    return date.split('T')[0];
  }

  getFormatToTime(date: string): string {
    let arr = date.split('T');
    let time_arr = arr[1].split('.');
    return arr[0] + ' ' + time_arr[0]
  }
  // "start_ts": "2016-09-25 17:09:51",
  //   "end_ts": "2016-09-25 17:09:51"
  get getCurrentDayStartTime(): string {
    let date = this.getCurrentLocalDate;
    let date_str = this.getFormatToDate(date.toISOString());
    // .split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    return date_str + ' ' + '00:00:00';
  }

  get getCurrentWeekStartTime(): string {
    let date = this.getCurrentLocalDate;
    date.setDate(date.getDate() - date.getDay());
    let date_str = this.getFormatToDate(date.toISOString());
    //  date.toLocaleDateString().split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    return date_str + ' ' + '00:00:00';
  }

  get getCurrentMonthStartTime(): string {
    let date = this.getCurrentLocalDate;
    date.setDate(0);
    let date_str = this.getFormatToDate(date.toISOString());
    // date.toLocaleDateString().split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    return date_str + ' ' + '00:00:00';
  }

  get getCurrentTime(): string {
    let date = this.getCurrentLocalDate;
    // let date_str = this.getFormatToDate(date.toISOString());
    // date.toLocaleDateString().split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    let time_str = this.getFormatToTime(date.toISOString());
    // date.toLocaleTimeString().split(':').map(v=>padStart(v.toString(), 2, '0')).join(':');
    return time_str;
  }

  getPageData(data: Array<any>, page: number, pageSize: number): any {
    // page = parseInt(page);
    let rowsCount = data.length;
    let currentPageRows = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return {
      rowsCount,
      currentPageRows
    };
  }

  formatDate(str: string, type?: string) {
    type = type || 'Time';
    if (type == 'Date') return str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2);
    else return str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2) + ' ' + str.substr(8, 2) + ':' + str.substr(10, 2);
  }

  getFormatDateToStr(str: string, type?: string) {
    let date = str.split(' ')[0].split('-');
    let time = str.split(' ')[1] ? str.split(' ')[1].split(':') : (type == 'start' ? ['00', '00'] : ['23', '59']);

    return date[0] + date[1] + date[2] + (time[0] + time[1] + '00');
  }

  formatISOToStr(str: string): string {
    let arr = str.split('T');
    if (arr.length < 2) {
      console.error("formatISOToStr's params must be ISO format.");
      return;
    }
    let time_arr = arr[1].split('.');
    let arr_date = arr[0].split('-');
    let arr_time = time_arr[0].split(':');
    return arr_date[0] + arr_date[1] + arr_date[2] + arr_time[0] + arr_time[1] + arr_time[2];
  }
  getDateFormate(date: Date): string {
    let year = date.getFullYear().toString();
    let month_cache = date.getMonth() + 1;
    let month = month_cache < 10 ? padStart(month_cache.toString(), 2, '0') : month_cache.toString();
    let day_cache = date.getDate();
    let day = day_cache < 10 ? padStart(day_cache.toString(), 2, '0') : day_cache.toString();
    let hour_cache = date.getHours();
    let hour = hour_cache < 10 ? padStart(hour_cache.toString(), 2, '0') : hour_cache.toString();
    let minute_cache = date.getMinutes();
    let minute = minute_cache < 10 ? padStart(minute_cache.toString(), 2, '0') : minute_cache.toString();
    let second_cache = date.getSeconds();
    let second = second_cache < 10 ? padStart(second_cache.toString(), 2, '0') : second_cache.toString();
    return year + month + day + hour + minute + second;
  }

  formatUndefinedValueToString(object: any): any {
    if (isArray(object)) {
      object = object.map(v => {
        for (let e in v) {
          if (v[e] !== 0) v[e] = v[e] || '';
        }
        return v;
      });
    } else if (isObject(object)) {
      for (let e in object) {
        if (object[e] !== 0) object[e] = object[e] || '';
      }
    }
    return object;
  }

  get uuid() {
    let init_timestamp = Date.now().toString();
    if (this.preTimeTamps.length === 0) {
      this.preTimeTamps.push(init_timestamp);
      return init_timestamp;
    } else {
      if (this.preTimeTamps.indexOf(init_timestamp) > -1) {
        while (this.preTimeTamps.indexOf(init_timestamp) > -1) {
          init_timestamp = (parseInt(init_timestamp) + 1).toString();
        }
        this.preTimeTamps.push(init_timestamp);
        return init_timestamp;
      } else {
        this.preTimeTamps.push(init_timestamp);
        return init_timestamp;
      }
    }
  }

  get getCurrentLocalDate() {
    let date = new Date();
    date.setHours(date.getHours() + 8);
    return date;
  }

  onFileChange(evt: any, callback: Function) {
    /* wire up file reader */
    const target: DataTransfer = (<DataTransfer>(evt.target));
    if (target.files.length != 1) throw new Error("Cannot upload multiple files on the entry");
    const reader = new FileReader();
    window['loading'].startLoading();
    reader.onload = function (e: any) {
      window['loading'].finishLoading();
      /* read workbook */
      const bstr = e.target.result;
      const wb = window['XLSX'].read(bstr, { type: 'binary' });
      // const wb = window['XLSX'].read(bstr, { type: 'buffer' });


      /* grab first sheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* save data to scope */
      callback(<AOA>(window['XLSX'].utils.sheet_to_json(ws, { header: 1 })));
    };
    reader.readAsBinaryString(target.files[0]);
    // reader.readAsText(target.files[0]);
  }

  export(): void {
    /* generate worksheet */
    const ws = window['XLSX'].utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb = window['XLSX'].utils.book_new();
    window['XLSX'].utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout = window['XLSX'].write(wb, this.wopts);
    console.log(this.fileName);
    saveAs(new Blob([s2ab(wbout)]), this.fileName);
  }

  isInvalidForm(form: any): void {
    for (let i in form.controls){
      if(form.controls[i].invalid) form.controls[i].markAsTouched();
    }
    return form.invalid;
  }
}