import { Beer } from '../../../models';
import { AdminService } from '../../../services/admin.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'keg-add',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class KegAddComponent {
    private subscriptions = [];

    beerToLoad: Beer;
    kegSizeToLoad: string;

    @Output() kegSubmitted = new EventEmitter();
    @Output() cancelled = new EventEmitter();

    constructor(
        private _adminService: AdminService,
        config: NgbTypeaheadConfig
    ) {
        config.focusFirst = false;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    submitNewKeg() {
        this.kegSubmitted.emit({
            Beer: this.beerToLoad,
            Size: this.kegSizeToLoad
        });
    }

    search = (text: Observable<string>) => {
        return text
            .debounceTime(500)
            .distinctUntilChanged()
            .filter(term => term.length > 4)
            .switchMap(term => this._adminService.search(term))
            .map(result => result.beers);
    };

    getBeerName(beer: Beer) {
        return beer.BeerName;
    }

    getBeerDisplay(beer: Beer) {
        return `${beer.Brewery.BreweryName}: ${beer.BeerName}`;
    }

    beerSelected(selection: any) {
        let beer: Beer = selection.item;
        this.beerToLoad = beer;
    }

    cancelKegAdd() {
        this.cancelled.emit(true);
    }
}
