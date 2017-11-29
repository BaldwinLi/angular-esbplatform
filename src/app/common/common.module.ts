
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { barChartComponent } from './components/barChartComponent';
import { lineChartComponent } from './components/lineChartComponent';
import { barChartDirective } from './directives/barChartDirective';
import { lineChartDirective } from './directives/lineChartDirective';
import { TemplateDirective } from './directives/TemplateDirective';
import { InitLayerModule } from './init.layer.module';


@NgModule({
  declarations: [
    barChartComponent,
    lineChartComponent,
    barChartDirective,
    lineChartDirective,
    TemplateDirective
  ],
  exports: [
    barChartComponent,
    lineChartComponent
  ],
  imports: [
    BrowserModule,
    // InitLayerModule
  ],
  providers: [],
  bootstrap: []
})
export class CommonModule { }
