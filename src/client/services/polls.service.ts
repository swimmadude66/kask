import { KegSize } from '../models';
import { Poll } from '../models/poll.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PollService {
    constructor(
        private http: Http
    ) { }

    getPolls(includeInactive: boolean): Observable<Poll[]> {
        return this.http.get(`/api/polls?includeInactive=${includeInactive}`)
        .map(res => res.json())
        .map(result => result.Polls)
    }

    getPoll(pollId: number): Observable<Poll> {
        return this.http.get(`/api/polls/${pollId}`)
        .map(res => res.json())
        .map(result => result.Poll)
    }

    vote(pollId: number, pollBeerId: number, vote: any): Observable<any> {
        return this.http.post(`/api/votes/poll/${pollId}/beer`, {
            PollBeerId: pollBeerId,
            Vote: vote
        }).map(res => res.json());
    }

    // admin routes
    createPoll(title: string, description: string, votesPerUser: number): Observable<any> {
        return this.http.post(`/api/admin/polls`, {
            Title: title,
            Description: description,
            VotesPerUser: votesPerUser
        }).map(res => res.json());
    }

    updatePoll(pollId: number, title?: string, description?: string, votesPerUser?: number) {
        return this.http.patch(`/api/admin/polls/${pollId}`, {
            Title: title,
            Description: description,
            VotesPerUser: votesPerUser
        }).map(res => res.json());
    }

    addBeerToPoll(pollId: number, beerId: number, size: KegSize) {
        return this.http.put(`/api/admin/polls/${pollId}/beer`, {
            BeerId: beerId,
            Size: size
        }).map(res => res.json());
    }

    removeBeerFromPoll(pollId: number, pollBeerId: number) {
        return this.http.delete(`/api/admin/polls/${pollId}/beer/${pollBeerId}`).map(res => res.json());
    }
}
