import { PollService } from '../../services/polls.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Poll } from '../../models/poll.model';
import { Vote } from '../../models/pollvote.model';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class PollsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    polls: Poll[];

    constructor(
        private pollService: PollService
    ) { }

    ngOnInit() {
        this.pollService.getPolls()
            .subscribe(activePolls => this.polls = activePolls);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    vote(poll: Poll, pollBeerId: number) {
        let vote: Vote = Vote.Up;
        let isUpVote = !this.votedForBeer(poll, pollBeerId);

        if (!isUpVote) {
            vote = Vote.None;
        }

        this.pollService.vote(poll.PollId, pollBeerId, vote).subscribe(_ => {
            if (!isUpVote) {
                poll.PollVotes = poll.PollVotes.filter(v => v.PollBeerId !== pollBeerId);
            } else {
                poll.PollVotes.push({
                    PollVoteId: -1,
                    UserId: -1,
                    PollBeerId: pollBeerId,
                    Vote: vote
                });
            }
        });
    }

    votedForBeer(poll: Poll, pollBeerId: number) {
        return poll.PollVotes.some(p => p.PollBeerId === pollBeerId && p.Vote === Vote.Up);
    }

    canVote(poll: Poll) {
        return poll.PollVotes.length < poll.VotesPerUser;
    }

    votesRemaining(poll: Poll) {
        return poll.VotesPerUser - poll.PollVotes.filter(v => v.Vote === Vote.Up).length;
    }
}
