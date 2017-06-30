import {Component, Input} from '@angular/core';
import {AdminService} from '../../../services/admin.service';
import {Keg} from '../../../models/keg.model';
import {Tap} from '../../../models/tap.model';
import {LocationService} from '../../../services/location.service';
import {TapService} from '../../../services/tap.service';
import {Location} from '../../../models/location.model';

@Component({
    selector: 'keg-move',
    templateUrl: './template.html',
    styleUrls: ['../../../styles.scss', './styles.scss']
})
export class KegRowComponent {

    @Input() info: Keg;
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
            if (this.selectedDestination.indexOf('tap_') === 0) {
                this._adminService.loadTapFromStorage(+this.selectedDestination.replace('tap_', ''), this.info.KegId)
                .subscribe();
            } else if (this.selectedDestination.indexOf('loc_') === 0) {
                let dest = +this.selectedDestination.replace('loc_', '');
                this._adminService.move(this.info.KegId, dest).subscribe();
            } else {
                this._adminService.clearKeg(this.info.KegId).subscribe(_ => _);
            }
        }
    }
}
