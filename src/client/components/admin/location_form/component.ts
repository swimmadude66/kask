import {LocationService} from '../../../services';
import {Location} from '../../../models';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'location-form',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class LocationFormComponent {

    private info: Location|{} = {};

    @Output() store = new EventEmitter<Location>()

    constructor(
        private _locationService: LocationService
    ) { }

    private submitLocation() {
        this._locationService.addLocation(this.info)
        .subscribe(
            id => {
                (<Location>this.info).LocationId = id;
                this.store.emit(<Location>this.info);
            },
            err => console.log(err)
        );
    }
}
