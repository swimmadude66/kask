import {Component, OnDestroy, OnInit} from '@angular/core';
import {TapService} from "../../services/tap.service";
import {Tap} from "../../models/tap.model";

@Component({
    selector: 'stats',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    private taps: Tap[];
    
    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        this._tapService.getTaps().subscribe(taps => {
            this.taps = taps;
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
