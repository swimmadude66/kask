import {Observable} from 'rxjs/Rx';
import {Style} from './style.model';
import {Brewery} from './brewery.model';
import {Beer} from './beer.model';

export interface RelatedBeer {
    BeerId: number;
    Name: string;
}

export interface Database {
    saveBeer(beer: Beer): Observable<number>;
    saveStyle(style: Style): Observable<number>;
    saveBrewery(brewery: Brewery): Observable<number>;

    getStyles(): Observable<Style[]>;
    getStyle(styleId: number): Observable<Style>;

    getBreweries(): Observable<Brewery[]>;
    getBrewery(breweryId: number): Observable<Brewery>;

    getBeers(): Observable<Beer[]>;
    getBeer(styleId: number): Observable<Beer>;
}
