import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
window['XLSX'] = XLSX;

@Component({
  selector: 'esb-config-home',
  templateUrl: 'templates/configHome.html'
})
export class configHomeComponent {
}
