import 'core-js/es6';

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
// import { InitLayerModule } from './app/common/init.layer.module';
import { environment } from './environments/environment';
import * as echarts from "echarts";
import * as moment from "moment";

import {Promise as promise}  from 'es6-promise';
// import 'angular2-layer/css/dialog.css';

window['echarts'] = echarts || {};

window['moment'] = moment || {};
// window['Promise'] = promise;
try{
  if(typeof window['Promise'] === 'undefined')
    window['Promise'] = promise;
}catch(e){
  console.error(e);
}


if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(InitLayerModule);

platformBrowserDynamic().bootstrapModule(AppModule);



