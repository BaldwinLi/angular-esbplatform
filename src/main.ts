import 'core-js/es6';

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
// import { InitLayerModule } from './app/common/init.layer.module';
import { environment } from './environments/environment';
import * as Echarts from "echarts";
import * as Moment from "moment";
// import * as SystemJS from 'systemjs';

import { Promise as promise } from 'es6-promise';

import * as JQuery from 'jquery';
window['$'] = window['jQuery'] = JQuery;
import 'jquery-resizable-columns';
import './lib/bootstrap/3.2.0/js/bootstrap.min';
import './lib/bootstrap/datepicker/js/bootstrap-datetimepicker.min';
// import * as Store from 'store';
// window['store'] = Store;
// import 'angular2-layer/css/dialog.css';

window['echarts'] = Echarts || {};

window['moment'] = Moment || {};

// var SystemJS = SystemJS;
// window['Promise'] = promise;
try {
  if (typeof window['Promise'] === 'undefined')
    window['Promise'] = promise;
} catch (e) {
  console.error(e);
}


if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(InitLayerModule);

platformBrowserDynamic().bootstrapModule(AppModule);



