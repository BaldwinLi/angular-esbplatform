import { Component, Input } from '@angular/core';
import {CommonService} from '../../services/common/CommonService';


@Component({
  selector: 'esb-bar-chart',
  templateUrl: 'templates/barChart.html'
})
export class barChartComponent {
  @Input() private barChatData: Array<any>;

  private barChartHeight: string;
  private barChartWeight: string;

  ngOnInit(){
    let obj = this;
    this.barChartHeight = (window['innerHeight']*0.32).toString();
    this.barChartWeight = (window['innerWidth']*0.65).toString();
    $(window).resize(()=>{ 
      obj.barChartHeight = (window['innerHeight']*0.32).toString();
      obj.barChartWeight = (window['innerWidth']*0.65).toString();
    });
  }
}
