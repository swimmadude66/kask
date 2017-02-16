import {LocationService} from '../../../services';
import {Beer, Location, KegSize} from '../../../models';
import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'location',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class LocationComponent implements OnInit {

    private contents: (Beer & {Size?: KegSize})[];
    private loaded: boolean;

    @Input() info: Location;

    constructor(
        private _locationService: LocationService
    ) { }

    ngOnInit() {
        if (this.info && this.info.LocationId) {
            this._locationService.getLocationContents(this.info.LocationId)
            .subscribe(
                beers => this.contents = beers,
                error => console.log(error),
                () => this.loaded = true
            );
        }
    }
}
