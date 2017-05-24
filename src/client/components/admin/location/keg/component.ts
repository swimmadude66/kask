import {Observable} from 'rxjs/Rx';
import {Component, Input} from '@angular/core';
import {AdminService} from '../../../../services/admin.service';
import {Keg} from '../../../../models/keg.model';
import {Location} from '../../../../models/location.model';
import {Tap} from '../../../../models/tap.model';
import {LocationService} from '../../../../services/location.service';
import {TapService} from '../../../../services/tap.service';

@Component({
    selector: 'keg-move',
    templateUrl: './template.html',
    styleUrls: ['../../../styles.scss', './styles.scss']
})
export class KegRowComponent {

    @Input() info: Keg;
    @Input() location: Location;
    @Input() taps: Tap[];
    @Input() locations: Location[];

    selectedDestination: string;

    constructor(
        private _adminService: AdminService,
        private _tapService: TapService,
        private _locationService: LocationService
    ) { }

    moveKeg() {
        if (!!this.selectedDestination) {
            if (this.selectedDestination.startsWith('tap_')) {
                this._adminService.loadTapFromStorage(+this.selectedDestination.replace('tap_', ''), this.info.KegId)
                .switchMap(_ => this._locationService.getLocationContents(this.location.LocationId))
                .subscribe();
            } else if (this.selectedDestination.startsWith('loc_')) {
                let dest = +this.selectedDestination.replace('loc_', '');
                this._adminService.move(this.info.KegId, dest)
                .switchMap(_ => Observable.forkJoin(
                    this._locationService.getLocationContents(this.location.LocationId),
                    this._locationService.getLocationContents(dest)
                ))
                .subscribe();
            }
        }
    }
}
