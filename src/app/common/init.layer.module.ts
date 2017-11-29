/**
 * 初始化layer模块类，
 * 现已经用掉， 以备未来拓展使用
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgLayerComponent } from "angular2-layer/angular2-layer";
import { DialogComponent } from "./components/DialogComponent";
import { InitComponent } from "./components/InitComponent";

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';


@NgModule({
  entryComponents:[NgLayerComponent, DialogComponent],
  declarations: [
    NgLayerComponent, 
    InitComponent,
    DialogComponent
  ],
  exports: [
    NgLayerComponent, 
    InitComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [InitComponent]
})
export class InitLayerModule { }
