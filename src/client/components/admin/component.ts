import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocationService} from '../../services/location.service';
import {Location} from '../../models';
import {AdminService} from '../../services/admin.service';
import {TapService} from '../../services/tap.service';
import {Tap} from '../../models/tap.model';

@Component({
    selector: 'admin',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    locations: Location[] = [];
    taps: Tap[] = [];

    constructor (
        private _locationService: LocationService,
        private _adminService: AdminService,
        private _tapService: TapService
    ) { }

    ngOnInit() {
        this._locationService.getLocations()
            .subscribe(locations => this.locations = locations);

        this._tapService.getTaps()
            .subscribe(taps => this.taps = taps);

    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    handleMove(result) {
        if (!!result.dest) {
            if (result.dest.indexOf('tap_') === 0) {
                this._adminService.loadTapFromStorage(+result.dest.replace('tap_', ''), result.kegId)
                .subscribe();
            } else if (result.dest.indexOf('loc_') === 0) {
                let dest = +result.dest.replace('loc_', '');
                this._adminService.move(result.kegId, dest).subscribe();
            } else {
                this._adminService.clearKeg(result.kegId).subscribe(_ => _);
            }
        }
    }
}
