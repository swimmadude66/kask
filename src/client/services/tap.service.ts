import {Observable} from 'rxjs/Rx';
import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Tap, Keg} from '../models';
import {TapSession} from '../models/session.model';

@Injectable()
export class TapService {

    constructor(
        private http: Http
    ) {}

    addTap(data): Observable<number> {
        return this.http.post('/api/admin/taps', data)
        .map(res => res.json())
        .map(res => res.TapId);
    }

    updateTap(data): Observable<boolean> {
        return this.http.patch('/api/admin/taps', data)
        .map(res => res.json())
        .map(res => res.Success);
    }

    vote(sessionId: number, isUpVote: string): Observable<Response> {
        return this.http.post(`/api/votes/session/${sessionId}`, {Vote: isUpVote});
    }

    deleteTap(tapid): Observable<boolean> {
        return this.http.delete(`/api/admin/taps/${tapid}`)
        .map(res => res.json())
        .map(res => res.Success);
    }

    getTaps(): Observable<Tap[]> {
        return this.http.get('/api/beers/taps')
        .map(res => res.json());
    }

    getTap(tapId: number): Observable<Tap[]> {
        return this.http.get(`/api/beers/tap/${tapId}`)
        .map(res => res.json());
    }

    getTapContents(tapId: number): Observable<TapSession> {
        return this.http.get(`/api/beers/contents/tap/${tapId}`)
        .map(res => res.json());
    }
}
