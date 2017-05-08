import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocationService} from "../../services/location.service";
import {Location} from "../../models";
import {Observable} from "rxjs/Rx";
import {AdminService} from "../../services/admin.service";
import {TapService} from "../../services/tap.service";
import {Tap} from "../../models/tap.model";

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

    // addTap() {
    //     this._tapService.addTap(this.info)
    //         .subscribe(
    //             id => {
    //                 this.info.TapId = id;
    //                 this.editing = false;
    //             }, err => console.log(err),
    //             () => this.loaded = true
    //         );
    // }
    
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    
}
