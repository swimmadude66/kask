import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    private userId: number;

    constructor(
        private _activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        let idString = this._activatedRoute.snapshot.queryParams['id'];
        if (!!idString) {
            this.userId = parseInt(idString, 10);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
