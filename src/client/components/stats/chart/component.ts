import {Observable} from 'rxjs/Rx';
import {StatsService} from '../../../services/stats.service';
import {Component, OnInit} from '@angular/core';
import {TapService} from '../../../services/tap.service';
import {Tap} from '../../../models/tap.model';

@Component({
    selector: 'taps-chart',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapsChartComponent implements OnInit {
    private taps: Tap[];
    // lineChart
    lineChartData: any[] = [];
    lineChartLabels = [];

    lineChartOptions: any = {
        responsive: true,
        tooltips: {
            callbacks: {
                label: (tooltipItems, data) => data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel + ' oz. poured'
            }
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Fl oz. Poured'
                }
            }],
            xAxes: [{
                type: 'time',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                }
            }]
        }
    };

    lineChartColors: any[] = [
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

    lineChartLegend: boolean = true;
    lineChartType: string = 'line';

    pourData: any[] = [];

    constructor(
        private _tapService: TapService,
        private _statService: StatsService
    ) { }

    ngOnInit() {
        // http://www.chartjs.org/docs/#chart-configuration-global-configuration

        window['Chart'].defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.8)';
        window['Chart'].defaults.global.defaultFontSize = 16;

        Observable.forkJoin(
            this._statService.getPours(),
            this._tapService.getTaps()
        ).subscribe(results => {
            let pours = results[0];
            let taps = results[1];
            this.pourData = pours.map(p => {
                let dt = new Date(p.Timestamp);
                p.Date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                p.Volume = Math.ceil(p.Volume / 29.57);
                return p;
            });
            this.taps = taps;
            let chartData = pours.reduce((prev, curr) => {
                if (!(curr.TapId in prev)) {
                    prev[curr.TapId] = [];
                }
                let tapDate = prev[curr.TapId].findIndex(data => data.x === curr.Date);
                if (tapDate < 0) {
                    prev[curr.TapId].push({x: curr.Date, y: curr.Volume});
                } else {
                     prev[curr.TapId][tapDate].y += curr.Volume;
                }
                return prev;
            }, {});
            this.lineChartLabels = pours.map(p => (p.x.getMonth() + 1) + '/' + p.x.getDate() + '/' + p.x.getFullYear());
            taps.forEach((tap, i) => {
                this.lineChartData.push({
                    data: chartData[tap.TapId],
                    label: tap.TapName
                });
            });
        });
    }
    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }
}
