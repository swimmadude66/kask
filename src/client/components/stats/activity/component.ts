import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Tap} from '../../../models/tap.model';

@Component({
    selector: 'taps-chart',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapsChartComponent implements OnInit, OnChanges {
    loaded: boolean = false;

    chartData: any[] = [];
    chartLabels = [];

    chartOptions: any = {
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
                    labelString: 'Amount Poured'
                },
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

    chartColors: any[] = [
        { // tap-color-1
            backgroundColor: 'rgba(252,91,85,0.8)',
            borderColor: 'rgba(252,91,85,1)',
            pointBackgroundColor: 'rgba(252,91,85,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,91,85,0.8)'
        },
        { // tap-color-2
            backgroundColor: 'rgba(114,242,94,0.8)',
            borderColor: 'rgba(114,242,94,1)',
            pointBackgroundColor: 'rgba(114,242,94,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(114,242,94,0.8)'
        },
        { // tap-color-3
            backgroundColor: 'rgba(252,106,240,0.8)',
            borderColor: 'rgba(252,106,240,1)',
            pointBackgroundColor: 'rgba(252,106,240,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,106,240,0.8)'
        },
        { // tap-color-4
            backgroundColor: 'rgba(122,175,255, 0.8)',
            borderColor: 'rgba(122,175,255, 1)',
            pointBackgroundColor: 'rgba(122,175,255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(122,175,255, 0.8)'
        }
    ];

    @Input() pours: any[];
    @Input() taps: Tap[];

    constructor(
    ) { }

    ngOnInit() {
        // http://www.chartjs.org/docs/#chart-configuration-global-configuration
        window['Chart'].defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.8)';
        window['Chart'].defaults.global.defaultFontSize = 16;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loadChartIfReady();
    }

    private loadChartIfReady() {
        this.loaded = false;

        if (!this.taps || !this.pours) {
            return;
        }

        let chartData = this.pours.map(p => {
            let dt = new Date(p.Timestamp.slice(0, -1));
            
            // group data by day
            return {
                Date:   new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()),
                Volume: Math.ceil(p.Volume / 29.57),
                TapId: p.TapId
            };
        }).reduce((result, curr) => {
            for(let tapId in result) {
                let tapIndexForDate = result[tapId].findIndex(data => data.x.getTime() === curr.Date.getTime());
                if (tapIndexForDate < 0) {
                    result[tapId].push({x: curr.Date, y: 0});
                }
            }

            let tapIndexForDate = result[curr.TapId].findIndex(data => data.x.getTime() === curr.Date.getTime());
            result[curr.TapId][tapIndexForDate].y += curr.Volume;

            return result;
        }, this.taps.reduce((result, tap) => {
            result[tap.TapId] = [];
            return result;
            }, {})
        );

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

        this.chartLabels = chartData[Object.keys(chartData)[0]].map(p => (p.x.getMonth() + 1) + '/' + p.x.getDate());

        let newChartData = [];

        this.taps.forEach(tap => {
            newChartData.push({
                data: chartData[tap.TapId].map(_ => _.y) || {},
                label: tap.TapName
            });
        });
        
        this.chartData = newChartData;

        // force chart labels redraw
        setTimeout(() => this.loaded = true, 0);
    }
}
