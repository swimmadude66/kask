import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {Location} from "../../models";

@Component({
    selector: 'admin',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    locations: Location[] = [];
    
    constructor (
        private _locationService: LocationService
    ) { }

    ngOnInit() {
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
