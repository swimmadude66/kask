import {Observable, Subject, ReplaySubject} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class StatsService {
    constructor(
        private http: Http
    ) {}

    pours: Subject<any[]> = new ReplaySubject(1);
    
    observePours() {
        return this.pours;
    }
    
    getPours(fromDate?: string, toDate?: string): Observable<any[]> {
        let url = '/api/stats/pours?';

        if (!!fromDate) {
            url += `fromDate=${fromDate}`;
        }

        if (!!toDate) {
            url += `&toDate=${toDate}`;
        }
        
        return this.http.get(url)
            .map(res => res.json().Pours)
            .do(_ => this.pours.next(_));
    }
}
