import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BeerService} from '../../../services/beer.service';
import {Style} from '../../../models/style.model';

@Component({
    selector: 'style-info',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class StyleInfoComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    style: Style;

    constructor(
        private _route: ActivatedRoute,
        private _beerService: BeerService
    ) { }

    ngOnInit() {
        let id: number = this._route.snapshot.params['id'];
        this._beerService.getStyle(id).subscribe(styleData => {
            this.style = <Style>styleData;
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
