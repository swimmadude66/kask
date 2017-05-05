import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class VotesComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    constructor(
    ) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
