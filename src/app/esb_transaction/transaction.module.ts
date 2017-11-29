/**
 * 初始化transaction模块类，
 * 现已经用掉， 以备未来拓展使用
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TransactionHomeComponent } from './components/TransactionHomeComponent';
import { TransactionDetailComponent } from './components/TransactionDetailComponent';
import { TransactionsListComponent } from './components/TransactionsListComponent';

import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'transactionhome',
    component: TransactionHomeComponent,
    children: [
      { path: 'transactiondetail', component: TransactionDetailComponent },
      { path: 'transactionslist', component: TransactionsListComponent },
      { path: '', redirectTo: '/transactionhome/transactionslist', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    TransactionHomeComponent,
    TransactionDetailComponent,
    TransactionsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forChild(appRoutes)
  ],
  providers: [],
  bootstrap: [ 
      TransactionHomeComponent
  ]
})
export class TransactionModule { }
