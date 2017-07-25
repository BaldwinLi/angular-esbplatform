import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[lineChart]' })
export class lineChartDirective {
    @Input() private data: any;
    @Input() private lineChartHeight: string;
    @Input() private lineChartWeight: string;
    constructor(private el: ElementRef, private rd: Renderer2) {

    }
    ngOnChanges(changes: any) {
        if (this.data) {
            if (this.el.nativeElement.childNodes.length > 1) {
                this.rd.removeChild(this.el.nativeElement, this.el.nativeElement.childNodes[0]);
                this.rd.removeChild(this.el.nativeElement, this.el.nativeElement.childNodes[0]);
                this.rd.removeAttribute(this.el.nativeElement, '_echarts_instance_');
            }
            let charData = this.data.error_trend;
            let daysArr = charData.map(v => v.day);
            let errCntArr = charData.map(v => v.errCnt);
            var myChart = window['echarts'].init(this.el.nativeElement);
            myChart.setOption({
                title: {
                    text: '服务错误产生数量趋势',
                    // subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['错误数量']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: daysArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '错误数量',
                        type: 'line',
                        data: errCntArr,
                        markPoint: {
                            // data: [
                                // { type: 'max', name: '最大值' },
                                // { type: 'min', name: '最小值' }
                            // ]
                        },
                        markLine: {
                            // data: [
                            //     { type: 'average', name: '平均值' }
                            // ]
                        }
                    }
                ]
            });
        }
    }

}