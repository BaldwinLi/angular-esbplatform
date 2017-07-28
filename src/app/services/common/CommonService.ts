import { Injectable } from '@angular/core';
import { padStart, isObject, isArray } from 'lodash';

@Injectable()
export class CommonService {

  constructor() { }

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
    let date = new Date();
    let date_str = this.getFormatToDate(date.toISOString());
    // .split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    return date_str + ' ' + '00:00:00';
  }

  get getCurrentWeekStartTime(): string {
    let date = new Date();
    date.setDate(date.getDate() - date.getDay());
    let date_str = this.getFormatToDate(date.toISOString());
    //  date.toLocaleDateString().split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    return date_str + ' ' + '00:00:00';
  }

  get getCurrentMonthStartTime(): string {
    let date = new Date();
    date.setDate(0);
    let date_str = this.getFormatToDate(date.toISOString());
    // date.toLocaleDateString().split('-').map(v=>padStart(v.toString(), 2, '0')).join('-');
    return date_str + ' ' + '00:00:00';
  }

  get getCurrentTime(): string {
    let date = new Date();
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
          if(v[e]!==0) v[e] = v[e] || ''
        }
        return v;
      });
    } else if (isObject(object)) {
      for (let e in object) {
        if(object[e]!==0) object[e] = object[e] || ''
      }
    }
    return object;
  }
}