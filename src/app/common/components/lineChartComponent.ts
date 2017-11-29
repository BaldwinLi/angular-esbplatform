import { Component, Input } from '@angular/core';


@Component({
  selector: 'esb-line-chart',
  templateUrl: 'templates/lineChart.html'
})
export class lineChartComponent {
  @Input() private lineChartData: any;

  private lineChartHeight: string;
  private lineChartWeight: string;

  ngOnInit(){
    let obj = this;
    this.lineChartHeight = (window['innerHeight']*0.32).toString();
    this.lineChartWeight = (window['innerWidth']*0.65).toString();
    $(window).resize(()=>{ 
      obj.lineChartHeight = (window['innerHeight']*0.32).toString();
      obj.lineChartWeight = (window['innerWidth']*0.65).toString();
    });
  }
}
