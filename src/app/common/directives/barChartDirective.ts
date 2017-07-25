import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[barChart]' })
export class barChartDirective {
    @Input() private data: Array<any>;
    @Input() private barChartHeight: string;
    @Input() private barChartWeight: string;
    constructor(private el: ElementRef, private rd: Renderer2) { }

    ngOnChanges(changes: any) {
        if (this.data) {
            if (this.el.nativeElement.childNodes.length > 1) {
                this.rd.removeChild(this.el.nativeElement, this.el.nativeElement.childNodes[0]);
                this.rd.removeChild(this.el.nativeElement, this.el.nativeElement.childNodes[0]);
                this.rd.removeAttribute(this.el.nativeElement, '_echarts_instance_');
            }
            this.data = this.data.sort((p, n) => (n.totalErrCnt - p.totalErrCnt));
            let arr: Array<any> = new Array(...this.data);
            arr = arr.length > 20 ? arr.slice(0, 20) : arr;
            let descArr = arr.map(v => v.svc_no);
            let todayErrCntArr = arr.map(v => v.todayErrCnt);
            let totalErrCntArr = arr.map(v => v.totalErrCnt);
            let myChart = window['echarts'].init(this.el.nativeElement);
            myChart.setOption({
                title: {
                    text: '服务错误数量',
                    // subtext: '纯属虚构'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['处理中', '累计错误']
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
                        data: descArr
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '处理中',
                        type: 'bar',
                        data: todayErrCntArr,
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
                    },
                    {
                        name: '累计错误',
                        type: 'bar',
                        data: totalErrCntArr,
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
    ngAfterViewChecked() {


    }
    ngOnInit() {

    }

}