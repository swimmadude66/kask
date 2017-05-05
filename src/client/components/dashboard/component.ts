import {TapService} from '../../services';
import {Tap} from '../../models';
import {Component, OnDestroy, OnInit} from '@angular/core';
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

    constructor(
        private _tapService: TapService,
        private _authService: AuthService
    ) { }

    ngOnInit() {
        this.subscriptions.push(
            this._tapService.getTaps()
            .subscribe(taps => this.taps = taps)
        );

        this.subscriptions.push(
          this._authService.isLoggedIn()
              .subscribe(_ => this.isLoggedIn = _)
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
