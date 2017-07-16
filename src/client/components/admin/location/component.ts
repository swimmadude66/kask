import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {Keg} from '../../../models/keg.model';
import {Location} from '../../../models/location.model';
import {LocationService} from '../../../services/location.service';
import {Beer} from '../../../models/beer.model';
import {AdminService} from '../../../services/admin.service';
import {Tap} from '../../../models/tap.model';

@Component({
    selector: 'location',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', './styles.scss']
})
export class LocationComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    contents: Keg[];
    loaded: boolean;
    editing: boolean;
    isAddingKeg: boolean;
    beerToLoad: Beer;
    kegSizeToLoad: string;
    otherLocations: Location[];

    @Input() info: Location;
    @Input() taps: Tap[];
    @Output() moveSubmitted = new EventEmitter();

    constructor(
        private _locationService: LocationService,
        private _adminService: AdminService
    ) {
    }

    ngOnInit() {
        if (this.info && this.info.LocationId) {
            this.subscriptions.push(
                this._locationService.observeLocationContents(this.info.LocationId)
                .merge(this._locationService.getLocationContents(this.info.LocationId))
                .subscribe(
                    beers => this.contents = beers,
                    error => console.log(error),
                    () => this.loaded = true
                )
            );

             this.subscriptions.push(
                this._locationService.getLocations()
                .map(locs => locs.filter(l => l.LocationId !== this.info.LocationId))
                .subscribe(
                    locs => this.otherLocations = locs
                )
             );
        } else {
            this.editing = true;
            this.loaded = true;
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    submitNewKeg(newKeg: any) {
        this.loaded = false;
        this._adminService.store(newKeg.Beer.BeerId, newKeg.Size, this.info.LocationId)
            .subscribe(
                () => this.isAddingKeg = false,
                err => console.error(err),
                () => this.loaded = true
            );
    }

    addLocation() {
        this.loaded = false;
        this._locationService.addLocation(this.info)
        .subscribe(
            id => {
                this.info.LocationId = id;
            },
            err => console.log(err),
            () => this.loaded = true
        );
    }

    editLocation() {
        this.loaded = false;
        this._locationService.updateLocation(this.info)
        .subscribe(
            success => {
                this.editing = false;
            },
            err => console.log(err),
            () => this.loaded = true
        );
    }

    submitLocation() {
        if (this.info.LocationId) {
            this.editLocation();
        } else {
            this.addLocation();
        }
    }

    handleMove(selectedDestination) {
        this.moveSubmitted.emit(selectedDestination);
    }
}
