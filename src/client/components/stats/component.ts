import {Component, OnDestroy, OnInit} from '@angular/core';
import {TapService} from "../../services/tap.service";
import {Tap} from "../../models/tap.model";
import {StatsService} from "../../services/stats.service";

@Component({
    selector: 'stats',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    private taps: Tap[];
    private pourData: any[];
    
    constructor(
        private _tapService: TapService,
        private _statsService: StatsService
    ) { }

    ngOnInit() {
        this._tapService.getTaps().subscribe(taps => {
            this.taps = taps;
        });

        this._statsService.getPours()
            .subscribe(pours => {
                this.pourData = pours.filter(x => x.Volume < 1000).map(p => {
                    let dt = new Date(p.Timestamp.slice(0, -1));
                    p.Date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                    p.Volume = Math.ceil(p.Volume / 29.57);
                    return p;
                });
            });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
