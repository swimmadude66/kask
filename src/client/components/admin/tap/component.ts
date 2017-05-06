import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Tap} from "../../../models/tap.model";
import {Observable} from "rxjs/Rx";
import {AdminService} from "../../../services/admin.service";
import {Beer} from "../../../models/beer.model";

@Component({
    selector: 'tap-edit',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', './styles.scss']
})
export class TapEditComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private isEditing: boolean;
    beerToLoad: Beer;
    @Input() info: Tap;
    
    constructor(
        private _adminService: AdminService
    ) { }

    ngOnInit() {
    }

    submitNewBeer() {
        console.log(this.beerToLoad);
    }

    search = (text$: Observable<string>) => {
        return text$
            .debounceTime(300)
            .distinctUntilChanged()
            .filter(term => term.length > 4)
            .switchMap(term => this._adminService.search(term))
            .map(result => result.beers)
    };
    
    getBeerName(beer:Beer) {
        return beer.BeerName
    }

    getBeerDisplay(beer:Beer) {
        return `${beer.Brewery.BreweryName}: ${beer.BeerName}`;
    }

    beerSelected(selection:any) {
        let beer: Beer = selection.item;
        console.log(beer);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
