import { Poll } from '../models/poll.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PollService {
    constructor(
        private http: Http
    ) { }

    getPolls(): Observable<Poll[]> {
        return this.http.get(`/api/polls`)
        .map(res => res.json())
        .map(result => result.Polls)
    }

    getPoll(pollId: number): Observable<Poll> {
        return this.http.get(`/api/polls/${pollId}`)
        .map(res => res.json())
        .map(result => result.Poll)
    }

    vote(pollId: number, pollBeerId: number, vote: any) {
        return this.http.post(`/api/votes/poll/${pollId}/beer`, {
            PollBeerId: pollBeerId,
            Vote: vote
        }).map(res => res.json());
    }
}
