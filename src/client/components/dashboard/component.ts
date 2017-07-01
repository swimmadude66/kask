import {TapService} from '../../services';
import {Tap} from '../../models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private subscriptions = [];
    taps: Tap[] = [];
    leftIndex: number = 0;
    isLoggedIn: boolean;
    isAdmin: boolean;

    constructor(
        private _tapService: TapService,
        private _authService: AuthService
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this._tapService.getTaps()
            .do(taps => this.taps = taps)
            .flatMap(taps => Observable.combineLatest(taps.map(t => this._tapService.observeTapInfo(t.TapId))))
            .subscribe(latestTaps => {
                this.taps = latestTaps;
                console.log('we got a new event', latestTaps)
            })
        );

        this.subscriptions.push(
          this._authService.isLoggedIn()
              .subscribe(_ => this.isLoggedIn = _)
        );

        this.subscriptions.push(
          this._authService.isAdmin()
              .subscribe(_ => this.isAdmin = _)
        );

        this.subscriptions.push(
          this._authService.checkIfLoggedIn().subscribe()
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    getVisibleTaps(): Tap[] {
        let visible = this.taps.slice(this.leftIndex, this.leftIndex + 4);
        return visible;
    }

    shiftRight() {
        this.leftIndex = Math.min(this.leftIndex + 4, this.taps.length - 4);
    }

    shiftLeft() {
        this.leftIndex = Math.max(this.leftIndex - 4, 0);
    }

    removeTap(tapId) {
        this.taps = this.taps.filter(tap => tap.TapId !== tapId);
        if (this.taps.length >= 4 && this.getVisibleTaps().length < 4) {
            this.shiftLeft();
        }
    }
}
