import { Component, OnDestroy, OnInit } from '@angular/core';
import { PollService } from '../../services/polls.service';
import { Poll } from '../../models/poll.model';
import { Vote } from '../../models/pollvote.model';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'polls',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class PollsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    polls: Poll[];

    isAdmin: boolean = false;
    isAddingPoll: boolean = false;

    constructor(
        private pollService: PollService,
        private authService: AuthService
    ) { }

    addPoll(poll) {
        this.isAddingPoll = false;
        this.pollService.createPoll(poll.title, poll.description, poll.votesPerUser).subscribe(_ => _);
    }

    ngOnInit() {
        this.authService.isAdmin()
        .do(isAdmin => this.isAdmin = isAdmin)
        .flatMap(isAdmin =>  this.pollService.getPolls(isAdmin))
        .subscribe(activePolls => this.polls = activePolls);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
