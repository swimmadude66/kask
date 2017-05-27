import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TapSession} from "../../../models/session.model";
import {Tap} from "../../../models/tap.model";
import * as Moment from 'moment';

@Component({
    selector: 'kegs-chart',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class KegsChartComponent implements OnInit, OnChanges {
    loaded: boolean = false;

    chartData: any[] = [];

    chartColors: any[];

    tapColors: any[] = [
        { // tap-color-1
            backgroundColor: 'rgba(252,91,85,0)',
            borderColor: 'rgba(252,91,85,1)',
            pointBackgroundColor: 'rgba(252,91,85,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,91,85,0.8)'
        },
        { // tap-color-2
            backgroundColor: 'rgba(114,242,94,0)',
            borderColor: 'rgba(114,242,94,1)',
            pointBackgroundColor: 'rgba(114,242,94,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(114,242,94,0.8)'
        },
        { // tap-color-3
            backgroundColor: 'rgba(252,106,240,0)',
            borderColor: 'rgba(252,106,240,1)',
            pointBackgroundColor: 'rgba(252,106,240,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(252,106,240,0.8)'
        },
        { // tap-color-4
            backgroundColor: 'rgba(122,175,255, 0)',
            borderColor: 'rgba(122,175,255, 1)',
            pointBackgroundColor: 'rgba(122,175,255, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(122,175,255, 0.8)'
        }
    ];

    chartOptions: any = {
        responsive: true,
        tooltips: {
            callbacks: {
                label: (tooltipItems, data) => data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel + ' oz. remaining.'
            }
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Keg Level'
                },
                ticks: {
                    callback: function(label, index, labels) {
                        return Math.round(label) +' oz';
                    }
                },
            }],
            xAxes: [{
                type: 'time',
            }]
        }
    };

    @Input() pours: any[];
    @Input() sessions: TapSession[];
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

        if (!this.sessions || !this.pours || !this.taps) {
            return;
        }

        let sessionKegIds = this.sessions.map(s => s.Keg.KegId);

        let chartData = this.pours
        .filter(p => sessionKegIds.includes(p.KegId))
        .map(p => {
            let dt = new Date(p.Timestamp.slice(0, -1));
            return {
                // group data into 4-hour blocks
                Date: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), Math.round(dt.getHours()/4)*4),
                Volume: Math.ceil(p.Volume / 29.57),
                KegId: p.KegId
            };
        }).reduce((result, curr) => {
            let kegId = curr.KegId;

            let indexForDate = result[kegId].findIndex(data => data.x.getTime() === curr.Date.getTime());
            if (indexForDate < 0) {
                let prevY = result[kegId][result[kegId].length - 1].y;
                
                result[kegId].push({x: curr.Date, y: prevY});
                indexForDate = 0;
            }
            result[kegId][indexForDate].y -= curr.Volume;

            return result;
        }, this.sessions.reduce((result, session) => {
            result[session.Keg.KegId] = [{
                x: new Date(session.TappedTime),
                y: Math.ceil(session.Keg.InitialVolume / 29.57)
            }];
            return result;
            }, {})
        );

        this.chartColors = [];
        let newChartData = [];

        this.sessions.forEach(session => {
            this.chartColors.push(this.tapColors[this.taps.findIndex(t => t.TapId === session.TapId)]);
            newChartData.push({
                data: chartData[session.Keg.KegId] || {},
                label: session.Keg.Beer.BeerName
            });
        });

        this.chartData = newChartData;

        // force chart labels redraw
        setTimeout(() => this.loaded = true, 0);
    }
}
