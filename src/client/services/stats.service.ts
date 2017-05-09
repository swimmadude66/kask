import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class StatsService {

    constructor(
        private http: Http
    ) {}

    getPours(): Observable<any[]> {
        return this.http.get('/api/stats/pours')
        .map(res => res.json().Pours);
    }
}
