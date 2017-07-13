import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { PollService } from '../../../services/polls.service';
import { Poll } from '../../../models/poll.model';
import { Vote } from '../../../models/pollvote.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'poll',
    templateUrl: './template.html',
    styleUrls: ['../../styles.scss', './styles.scss']
})
export class PollComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    @Input() poll: Poll;
    @Input() isAdmin: boolean;

    isAddingKeg: boolean = false;
    isEditing: boolean = false;

    constructor(
        private pollService: PollService,
        private authService: AuthService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    vote(pollBeerId: number) {
        let vote: Vote = Vote.Up;
        let isUpVote = !this.votedForBeer(pollBeerId);

        if (!isUpVote) {
            vote = Vote.None;
        }

        this.pollService.vote(this.poll.PollId, pollBeerId, vote).subscribe(_ => {
            if (!isUpVote) {
                this.poll.PollVotes = this.poll.PollVotes.filter(v => v.PollBeerId !== pollBeerId);
            } else {
                this.poll.PollVotes.push({
                    PollVoteId: -1,
                    UserId: -1,
                    PollBeerId: pollBeerId,
                    Vote: vote
                });
            }
        });
    }

    votedForBeer(pollBeerId: number) {
        return this.poll.PollVotes.some(p => p.PollBeerId === pollBeerId && p.Vote === Vote.Up);
    }

    canVote() {
        return this.poll.PollVotes.length < this.poll.VotesPerUser;
    }

    votesRemaining() {
        return this.poll.VotesPerUser - this.poll.PollVotes.filter(v => v.Vote === Vote.Up).length;
    }

    addKegToPoll(kegToAdd: any) {
        //TODO: observable push here so the new poll is added to view
        this.pollService.addBeerToPoll(this.poll.PollId, kegToAdd.Beer.BeerId, kegToAdd.Size).subscribe(_ => _);
    }

    removeKegFromPoll(pollBeerId: number) {
        this.pollService.removeBeerFromPoll(this.poll.PollId, pollBeerId).subscribe(_ => _);
    }

    submitEdit(pollData: any) {
        this.isEditing = false;
        this.pollService.updatePoll(this.poll.PollId, pollData.title, pollData.description, pollData.votesPerUser).subscribe(_ => _);
    }
}
