import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BeerService} from '../../../services/beer.service';
import {Beer} from '../../../models/beer.model';

@Component({
    selector: 'beer-info',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', '../styles.scss', './styles.scss']
})
export class BeerInfoComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    beer: Beer;

    constructor(
        private _route: ActivatedRoute,
        private _beerService: BeerService
    ) { }

    ngOnInit() {
        let beerId: number = this._route.snapshot.params['id'];
        this._beerService.getBeer(beerId).subscribe(beerData => {
            this.beer = <Beer>beerData;
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    getImage(): string {
        if (this.beer) {
            if (this.beer.LabelUrl) {
                return this.beer.LabelUrl;
            } else if (this.beer.Brewery && this.beer.Brewery.Image) {
                return this.beer.Brewery.Image;
            }
        }
        return '';
    }
}
