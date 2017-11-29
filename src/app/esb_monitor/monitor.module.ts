
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { monitorComponent } from './components/monitorComponent';
import { monitorHomeComponent } from './components/monitorHomeComponent';
import { servicesInfoComponent } from './components/servicesInfoComponent';
import { servicesListComponent } from './components/servicesListComponent';
/**
 * 初始化monitor模块类，
 * 现已经用掉， 以备未来拓展使用
 */
import { serviceDetailComponent } from './components/serviceDetailComponent';

import { CommonModule } from '../common/common.module';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'monitor',
    component: monitorComponent,
    children: [
      { path: 'monitorhome', component: monitorHomeComponent },
      { path: 'serviceslist/:service_type', component: servicesListComponent },
      { path: 'servicedetail/:err_id', component: serviceDetailComponent },
      { path: '', redirectTo: '/monitor/monitorhome', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    monitorComponent,
    monitorHomeComponent,
    servicesInfoComponent,
    servicesListComponent,
    serviceDetailComponent
  ],
  exports: [
    monitorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(appRoutes)
  ],
  providers: [],
  bootstrap: [
    monitorComponent
  ]
})
export class MonitorModule { }
