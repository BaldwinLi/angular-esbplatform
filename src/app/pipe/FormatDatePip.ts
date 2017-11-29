import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common/CommonService';

@Pipe({ name: 'formatdate' })
export class FormatDatePip implements PipeTransform {

  constructor(private cmm: CommonService) { }

  transform(date: string, type: string): string {
    if (!!date) {
      if (type == 'toTime') {
        return this.cmm.getFormatToTime(date);
      } else {
        return this.cmm.getFormatToDate(date);
      }
    }
  }
}