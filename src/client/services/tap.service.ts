import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Tap, Beer, KegSize} from '../models';

@Injectable()
export class TapService {

    constructor(
        private http: Http
    ) {}

    getTaps(): Observable<Tap[]> {
        return this.http.get('/api/beers/taps')
        .map(res => res.json());
    }

    getTap(tapId: number): Observable<Tap[]> {
        return this.http.get(`/api/beers/tap/${tapId}`)
        .map(res => res.json());
    }

    getTapContents(tapId: number): Observable<Beer & {Size?: KegSize}> {
        return this.http.get(`/api/beers/contents/tap/${tapId}`)
        .map(res => res.json());
    }
}
