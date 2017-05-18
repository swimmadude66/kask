import {Observable} from 'rxjs/Rx';
import {StatsService} from '../../../services/stats.service';
import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {TapService} from '../../../services/tap.service';
import {Tap} from '../../../models/tap.model';

@Component({
    selector: 'taps-chart',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapsChartComponent implements OnInit, OnChanges {
    loaded: boolean = false;

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
                // scaleLabel: {
                //     display: true,
                //     labelString: 'Amount Poured'
                // },
                ticks: {
                    callback: function(label, index, labels) {
                        return Math.round(label) +' oz';
                    }
                },
            }],
            // xAxes: [{
            //     scaleLabel: {
            //         display: true,
            //         labelString: 'Date'
            //     }
            // }]
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

    pourData: any[];

    @Input() taps: Tap[];

    constructor(
        private _tapService: TapService,
        private _statService: StatsService
    ) { }

    ngOnInit() {
        // http://www.chartjs.org/docs/#chart-configuration-global-configuration

        window['Chart'].defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.8)';
        window['Chart'].defaults.global.defaultFontSize = 16;

        this._statService.getPours()
            .subscribe(pours => {
                this.pourData = pours.filter(x => x.Volume < 1000).map(p => {
                    let dt = new Date(p.Timestamp.slice(0, -1));
                    p.Date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                    p.Volume = Math.ceil(p.Volume / 29.57);
                    return p;
                });

                this.loadChartIfReady();
            });
    }

    ngOnChanges(changes: any) {
        this.loadChartIfReady();
    }

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    private loadChartIfReady() {
        if (!this.taps || !this.pourData) {
            return;
        }
        let chartData = this.pourData.reduce((prev, curr) => {
            if (!(curr.TapId in prev)) {
                prev[curr.TapId] = [];
            }

            for(let tapId in prev) {
                let tapIndexForDate = prev[tapId].findIndex(data => data.x.getTime() === curr.Date.getTime());
                if (tapIndexForDate < 0) {
                    prev[tapId].push({x: curr.Date, y: 0});
                }
            }

            let tapIndexForDate = prev[curr.TapId].findIndex(data => data.x.getTime() === curr.Date.getTime());
            prev[curr.TapId][tapIndexForDate].y += curr.Volume;

            return prev;
        }, {});

        //sort the data by date
        for(let tapId in chartData) {
            chartData[tapId].sort((a,b) => {
                let key1 = a.x;
                let key2 = b.x;

                if (key1 < key2) {
                    return -1;
                } else if (key1 == key2) {
                    return 0;
                } else {
                    return 1;
                }
            });
        }

        this.lineChartLabels = chartData[Object.keys(chartData)[0]].map(p => (p.x.getMonth() + 1) + '/' + p.x.getDate());

        let newLineChartData = []

        this.taps.forEach(tap => {
            newLineChartData.push({
                data: chartData[tap.TapId] || {},
                label: tap.TapName
            });
        });

        this.lineChartData = newLineChartData;

        this.loaded = true;
    }
}
