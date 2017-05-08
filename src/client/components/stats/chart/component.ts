import {Component, OnDestroy, OnInit} from '@angular/core';
import {TapService} from "../../../services/tap.service";
import {Tap} from "../../../models/tap.model";

@Component({
    selector: 'taps-chart',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapsChartComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    private taps: Tap[];

    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        // http://www.chartjs.org/docs/#chart-configuration-global-configuration

        window['Chart'].defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.8)';
        window['Chart'].defaults.global.defaultFontSize = 16;


        this._tapService.getTaps().subscribe(taps => {
            this.taps = taps;

            for(let i in taps) {
                this.lineChartData.push( {data: [
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100),
                    Math.round(Math.random()*100)
                ], label: taps[i].TapName});
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    // lineChart
    lineChartData:Array<any> = [];

    public lineChartLabels:Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    public lineChartOptions:any = {
        responsive: true
    };

    public lineChartColors:Array<any> = [
        { // tap-color-1
            //backgroundColor: 'rgba(252,91,85,0.2)',
            borderColor: 'rgba(252,91,85,1)',
            pointBackgroundColor: 'rgba(252,91,85,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,91,85,0.8)'
        },
        { // tap-color-2
            //backgroundColor: 'rgba(114,242,94,0.2)',
            borderColor: 'rgba(114,242,94,1)',
            pointBackgroundColor: 'rgba(114,242,94,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(114,242,94,0.8)'
        },
        { // tap-color-3
            //backgroundColor: 'rgba(252,106,240,0.2)',
            borderColor: 'rgba(252,106,240,1)',
            pointBackgroundColor: 'rgba(252,106,240,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,106,240,0.8)'
        },
        { // tap-color-4
            //backgroundColor: 'rgba(122,175,255, 0.2)',
            borderColor: 'rgba(122,175,255, 1)',
            pointBackgroundColor: 'rgba(122,175,255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(122,175,255, 0.8)'
        }
    ];
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }
}
