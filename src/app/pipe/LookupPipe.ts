import { Pipe, PipeTransform } from '@angular/core';
import * as dataModel from '../model/data-model';
@Pipe({ name: 'lookup' })
export class LookupPipe implements PipeTransform {
  transform(id: string, lookup_type: string): string {
    if(!dataModel[lookup_type] || !Array.isArray(dataModel[lookup_type])){
      console.error('lookup_type: ' + lookup_type + ' doesn\'t exist');
      return '';
    }
    for (let e of dataModel[lookup_type]) {
      if (e.id == id) {
        return e.value;
      }
    }
    return '';
  }
}