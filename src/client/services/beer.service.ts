import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Tap, Keg} from '../models';
import {Beer} from "../models/beer.model";
import {Brewery} from "../models/brewery.model";
import {Style} from "../models/style.model";

@Injectable()
export class BeerService {

    constructor(
        private http: Http
    ) {}

    getBeer(beerId: number): Observable<Beer> {
        return this.http.get(`/api/beers/${beerId}`)
            .map(res => res.json());
    }

    getBrewery(breweryId: number): Observable<Brewery> {
        return this.http.get(`/api/beers/breweries/${breweryId}`)
            .map(res => res.json());
    }

    getStyle(styleId: number): Observable<Style> {
        return this.http.get(`/api/beers/styles/${styleId}`)
            .map(res => res.json());
    }
}
