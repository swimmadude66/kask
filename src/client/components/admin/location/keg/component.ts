import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
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
export class KegRowComponent implements OnInit {

    @Input() info: Keg;
    @Input() location: Location;
    @Input() taps: Tap[];

    selectedTapId: number = null;

    constructor(
        private _adminService: AdminService,
        private _tapService: TapService,
        private _locationService: LocationService
    ) { }

    ngOnInit() { }

    tapKeg() {
        if (!!this.selectedTapId) {
            this._adminService.loadTapFromStorage(this.selectedTapId, this.info.KegId)
                .switchMap(_ => Observable.forkJoin(
                    this._tapService.getTapContents(this.selectedTapId),
                    this._locationService.getLocationContents(this.location.LocationId)
                ))
                .subscribe();
        }
    }
}
