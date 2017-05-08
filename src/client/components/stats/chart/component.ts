import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {TapService} from "../../../services/tap.service";
import {Tap} from "../../../models/tap.model";

@Component({
    selector: 'taps-chart',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapsChartComponent implements OnInit {
    private taps: Tap[];

    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        // http://www.chartjs.org/docs/#chart-configuration-global-configuration

        window['Chart'].defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.8)';
        window['Chart'].defaults.global.defaultFontSize = 16;
    }


    @Input('taps')
    set setTaps(taps: Tap[]) {
        this.taps = taps;
        for(let i in this.taps) {
            let d = new Date();
            this.lineChartLabels = [
                this.getNthDateStringBeforeToday(6),
                this.getNthDateStringBeforeToday(5),
                this.getNthDateStringBeforeToday(4),
                this.getNthDateStringBeforeToday(3),
                this.getNthDateStringBeforeToday(2),
                this.getNthDateStringBeforeToday(1),
                this.getNthDateStringBeforeToday(0),
            ];
            this.lineChartData.push({
                data: [
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100)
                ],
                label: this.taps[i].TapName
            });
        }
    }

    // lineChart
    lineChartData:Array<any> = [];

    lineChartLabels = [];
    lineChartOptions:any = {
        responsive: true
    };

    lineChartColors:Array<any> = [
        { // tap-color-1
            backgroundColor: 'rgba(252,91,85,0.05)',
            borderColor: 'rgba(252,91,85,1)',
            pointBackgroundColor: 'rgba(252,91,85,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,91,85,0.8)'
        },
        { // tap-color-2
            backgroundColor: 'rgba(114,242,94,0.05)',
            borderColor: 'rgba(114,242,94,1)',
            pointBackgroundColor: 'rgba(114,242,94,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(114,242,94,0.8)'
        },
        { // tap-color-3
            backgroundColor: 'rgba(252,106,240,0.05)',
            borderColor: 'rgba(252,106,240,1)',
            pointBackgroundColor: 'rgba(252,106,240,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,106,240,0.8)'
        },
        { // tap-color-4
            backgroundColor: 'rgba(122,175,255, 0.05)',
            borderColor: 'rgba(122,175,255, 1)',
            pointBackgroundColor: 'rgba(122,175,255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(122,175,255, 0.8)'
        }
    ];
    lineChartLegend:boolean = true;
    lineChartType:string = 'line';

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }

    private getNthDateStringBeforeToday(n) {
        let today = new Date();
        let dateToReturn = new Date(today.getTime() - (n * 24 * 60 * 60 * 1000));

        return  (dateToReturn.getMonth() + 1) + '/' + dateToReturn.getDate();

    }
}
