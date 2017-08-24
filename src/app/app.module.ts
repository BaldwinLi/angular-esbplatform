import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { daysOfWeek, months, date_locale } from '../lib/locales/i18n';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule, Routes } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiDatetimePickerModule, NguiDatetime } from '@ngui/datetime-picker';
import { NgLayerComponent } from 'angular2-layer/angular2-layer';
// import { CommonModule } from './common/common.module';
// import { MonitorModule } from './esb_monitor/monitor.module';
// import { ConfigModule } from './esb_config/config.module';
// import { TransactionModule } from './esb_transaction/transaction.module';
// import { InitLayerModule } from './common/init.layer.module';
// 首页模板组件依赖
import { homeComponent } from './homeComponent';
import { PageNotFoundComponent } from './PageNotFoundComponent';
import { monitorComponent } from './esb_monitor/components/monitorComponent';
import { configHomeComponent } from './esb_config/components/configHomeComponent';
import { TransactionHomeComponent } from './esb_transaction/components/TransactionHomeComponent';
// common组件相关依赖
import { TemplateDirective } from './common/directives/TemplateDirective';
import { DialogComponent } from './common/components/DialogComponent';
import { barChartComponent } from './common/components/barChartComponent';
import { lineChartComponent } from './common/components/lineChartComponent';
import { barChartDirective } from './common/directives/barChartDirective';
import { lineChartDirective } from './common/directives/lineChartDirective';
import { PaginationComponent } from './common/components/PaginationComponent';
import { DatatableComponent } from './common/components/DatatableComponent';
import { FlexDatatableComponent } from './common/components/FlexDatatableComponent';
import { MoveRowsDatatableComponent } from './common/components/MoveRowsDatatableComponent';
import { ArrListDialogComponent } from './common/components/ArrListDialogComponent';
import { ImportOperateDialogComponent } from './common/components/ImportOperateDialogComponent';
// 服务错误相关依赖
import { monitorHomeComponent } from './esb_monitor/components/monitorHomeComponent';
import { serviceDetailComponent } from './esb_monitor/components/serviceDetailComponent';
import { servicesListComponent } from './esb_monitor/components/servicesListComponent';
import { servicesInfoComponent } from './esb_monitor/components/servicesInfoComponent';
import { ServicesListDialogComponent } from './esb_monitor/components/dialogComponents/ServicesListDialogComponent';
import { ServicesListSharingDialogComponent } from './esb_monitor/components/dialogComponents/ServicesListSharingDialogComponent';
import { ErrorFlowDialogComponent } from './esb_monitor/components/dialogComponents/ErrorFlowDialogComponent';
// 平台配置相关依赖
import { NavbarComponent } from './esb_config/components/NavbarComponent';
import { mappingConfigComponent } from './esb_config/components/mappingConfigComponent';
import { mdmConfigComponent } from './esb_config/components/mdmConfigComponent';
import { serviceConfigComponent } from './esb_config/components/serviceConfigComponent';
import { SubscribeConfigComponent } from './esb_config/components/SubscribeConfigComponent';
import { systemConfigComponent } from './esb_config/components/systemConfigComponent';
import { ContactsConfigComponent } from './esb_config/components/ContactsConfigComponent';
import { ShareListComponent } from './esb_config/components/ShareListComponent';
import { EmailConfigComponent } from './esb_config/components/EmailConfigComponent';
import { ErrflowConfigComponent } from './esb_config/components/ErrflowConfigComponent';
import { ErrorFlowConfigEditDialogComponent } from './esb_config/components/dialogComponents/ErrorFlowConfigEditDialogComponent';
import { ErrflowConfigFormDialogComponent } from './esb_config/components/dialogComponents/ErrflowConfigFormDialogComponent';
import { MappingConfigDialogComponent } from './esb_config/components/dialogComponents/MappingConfigDialogComponent';
import { MdmConfigFormDialogComponent } from './esb_config/components/dialogComponents/MdmConfigFormDialogComponent';
import { ServiceConfigFormDialogComponent } from './esb_config/components/dialogComponents/ServiceConfigFormDialogComponent';
import { SystemConfigFormDialogComponent } from './esb_config/components/dialogComponents/SystemConfigFormDialogComponent';
import { ContactsConfigFormDialogComponent } from './esb_config/components/dialogComponents/ContactsConfigFormDialogComponent';
import { EmailConfigFormDialogComponent } from './esb_config/components/dialogComponents/EmailConfigFormDialogComponent';
import { SubscribeConfigDialogComponent } from './esb_config/components/dialogComponents/SubscribeConfigDialogComponent';
// 交易页面相关依赖
import { TransactionDetailComponent } from './esb_transaction/components/TransactionDetailComponent';
import { TransactionsListComponent } from './esb_transaction/components/TransactionsListComponent';
// 引入服务依赖
import { HttpService } from './services/common/HttpService';
import { AppRequestService } from './services/common/AppRequestService';
import { CommonService } from './services/common/CommonService';
import { KeyListService } from './services/KeyListService';
import { ErrorInfoService } from './services/ErrorInfoService';
import { ErrorFlowsService } from './services/ErrorFlowsService';
import { ErrorStepsService } from './services/ErrorStepsService';
import { TranResendService } from './services/TranResendService';
import { TranLogService } from './services/TranLogService';
import { UsersInfoService } from './services/UsersInfoService';
import { SystemsService } from './services/SystemsService';
import { SysContactsService } from './services/SysContactsService';
import { MdmConsumersService } from './services/MdmConsumersService';
import { EsbConfigsService } from './services/EsbConfigsService';
import { CachesService } from './services/CachesService';
import { TokenService } from './services/TokenService';
import { EmailInfoService } from './services/EmailInfoService';
// 引入管道
import { LookupPipe } from './pipe/LookupPipe';
import { FormatDatePip } from './pipe/FormatDatePip';

import { ComboBoxModule } from 'ng2-combobox';

NguiDatetime.daysOfWeek = daysOfWeek;

NguiDatetime.locale = date_locale;

NguiDatetime.months = months;




const appRoutes: Routes = [
  {
    path: 'monitor', component: monitorComponent,
    children: [
      { path: 'monitorhome', component: monitorHomeComponent },
      { path: 'serviceslist/:svc_no', component: servicesListComponent },
      { path: 'servicedetail', component: serviceDetailComponent },
      { path: '', redirectTo: '/monitor/monitorhome', pathMatch: 'full' }
    ]
  },
  {
    path: 'confighome', component: configHomeComponent,
    children: [
      { path: 'mdmconfig', component: mdmConfigComponent },
      { path: 'serviceconfig', component: serviceConfigComponent },
      { path: 'subscribeconfig', component: SubscribeConfigComponent },
      { path: 'systemconfig', component: systemConfigComponent },
      { path: 'mappingconfig', component: mappingConfigComponent },
      { path: 'contactsconfig', component: ContactsConfigComponent },
      { path: 'emailconfig', component: EmailConfigComponent },
      { path: 'errflowconfig', component: ErrflowConfigComponent },
      { path: 'myshare', component: ShareListComponent },
      { path: '', redirectTo: '/confighome/mappingconfig', pathMatch: 'full' }
    ]
  },
  {
    path: 'transactionhome', component: TransactionHomeComponent,
    children: [
      { path: 'transactiondetail', component: TransactionDetailComponent },
      { path: 'transactionslist', component: TransactionsListComponent },
      { path: '', redirectTo: '/transactionhome/transactionslist', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/monitor/monitorhome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({

  entryComponents: [
    NgLayerComponent,
    DialogComponent,
    ArrListDialogComponent,
    ImportOperateDialogComponent,
    ServicesListDialogComponent,
    ServicesListSharingDialogComponent,
    ErrorFlowDialogComponent,
    MappingConfigDialogComponent,
    MdmConfigFormDialogComponent,
    ServiceConfigFormDialogComponent,
    SystemConfigFormDialogComponent,
    ContactsConfigFormDialogComponent,
    EmailConfigFormDialogComponent,
    ErrflowConfigFormDialogComponent,
    ErrorFlowConfigEditDialogComponent,
    SubscribeConfigDialogComponent
  ],
  declarations: [
    homeComponent,
    barChartComponent,
    lineChartComponent,
    barChartDirective,
    lineChartDirective,
    DatatableComponent,
    MoveRowsDatatableComponent,
    TemplateDirective,
    PaginationComponent,
    FlexDatatableComponent,
    PageNotFoundComponent,
    NgLayerComponent,
    DialogComponent,
    ArrListDialogComponent,
    ImportOperateDialogComponent,
    ServicesListDialogComponent,
    ServicesListSharingDialogComponent,
    ErrorFlowDialogComponent,
    SubscribeConfigDialogComponent,
    monitorComponent,
    monitorHomeComponent,
    serviceDetailComponent,
    servicesListComponent,
    servicesInfoComponent,
    TransactionsListComponent,
    TransactionDetailComponent,
    TransactionHomeComponent,
    configHomeComponent,
    NavbarComponent,
    mappingConfigComponent,
    mdmConfigComponent,
    serviceConfigComponent,
    SubscribeConfigComponent,
    systemConfigComponent,
    ContactsConfigComponent,
    ShareListComponent,
    EmailConfigComponent,
    EmailConfigFormDialogComponent,
    ErrflowConfigComponent,
    ErrflowConfigFormDialogComponent,
    ErrorFlowConfigEditDialogComponent,
    MappingConfigDialogComponent,
    MdmConfigFormDialogComponent,
    ServiceConfigFormDialogComponent,
    SystemConfigFormDialogComponent,
    ContactsConfigFormDialogComponent,
    LookupPipe,
    FormatDatePip
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    // ConfigModule,
    // TransactionModule,
    // CommonModule,
    // MonitorModule,
    ComboBoxModule,
  ],
  providers: [
    HttpService,
    AppRequestService,
    CommonService,
    KeyListService,
    ErrorInfoService,
    ErrorFlowsService,
    ErrorStepsService,
    TranResendService,
    TranLogService,
    UsersInfoService,
    SystemsService,
    SysContactsService,
    MdmConsumersService,
    EsbConfigsService,
    CachesService,
    TokenService,
    EmailInfoService
  ],
  bootstrap: [
    homeComponent
  ]
})
export class AppModule { }
