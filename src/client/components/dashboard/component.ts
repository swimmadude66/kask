import {TapService, LocationService} from '../../services';
import {Tap, Location} from '../../models';
import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    private taps: Tap[] = [];
    private locations: Location[] = [];
    constructor(
        private _tapService: TapService,
        private _locationService: LocationService
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this._tapService.getTaps()
            .subscribe(taps => this.taps = taps)
        );

        this.subscriptions.push(
            this._locationService.getLocations()
            .subscribe(locations => this.locations = locations)
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
