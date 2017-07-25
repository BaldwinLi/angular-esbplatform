/**
 * 初始化config模块类，
 * 现已经用掉， 以备未来拓展使用
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { mdmConfigComponent } from './components/mdmConfigComponent';
import { mappingConfigComponent } from './components/mappingConfigComponent';
import { serviceConfigComponent } from './components/serviceConfigComponent';
import { systemConfigComponent } from './components/systemConfigComponent';
import { configHomeComponent } from './components/configHomeComponent';

import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'confighome',
    component: configHomeComponent,
    children: [
      { path: 'mdmconfig', component: mdmConfigComponent },
      { path: 'serviceconfig', component: serviceConfigComponent },
      { path: 'systemconfig', component: systemConfigComponent },
      { path: 'mappingconfig', component: mappingConfigComponent },
      { path: '', redirectTo: '/confighome/mdmconfig', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    configHomeComponent,
    mdmConfigComponent,
    mappingConfigComponent,
    serviceConfigComponent,
    systemConfigComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forChild(appRoutes)
  ],
  providers: [],
  bootstrap: [
    configHomeComponent
  ]
})
export class ConfigModule { }
