import {AdminService} from '../../../services/admin.service';
import {TapService} from '../../../services/tap.service';
import {Tap, TapSession} from '../../../models';
import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';

@Component({
    selector: 'tap',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    tapSession: TapSession;
    loaded: boolean;
    editing: boolean = false;
    originalScale = 100;

    @Input() info: Tap;
    @Input() tapNum: number;
    @Input() isLoggedIn: boolean;
    @Input() isAdmin: boolean;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _tapService: TapService,
        private _adminService: AdminService
    ) { }

    ngOnInit() {
        if (this.info && this.info.TapId) {
            this.subscriptions.push(
                this._tapService.observeTapContents(this.info.TapId).subscribe(
                    tapSession => this.tapSession = tapSession,
                    error => console.log(error),
                    () => this.loaded = true
            ));

            // poll the tap
            this.subscriptions.push(
                Observable.timer(0, 30000)
                    .switchMap(() => this._tapService.getTapContents(this.info.TapId))
                    .subscribe()
            );
        } else {
            this.editing = true;
            this.loaded = true;
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    getImage(): string {
        if (this.tapSession && this.tapSession.Keg && this.tapSession.Keg.Beer) {
            if (this.tapSession.Keg.Beer.LabelUrl) {
                return this.tapSession.Keg.Beer.LabelUrl;
            } else if (this.tapSession.Keg.Beer.Brewery && this.tapSession.Keg.Beer.Brewery.Image) {
                return this.tapSession.Keg.Beer.Brewery.Image;
            }
        }
        return '';
    }

    vote(vote: string) {
        if (this.tapSession && this.tapSession.UserVote) {
            if (((this.tapSession.UserVote === 1) && (vote === 'up')) || ((this.tapSession.UserVote === -1) && (vote === 'down'))) {
                vote = 'none';
            }
        }
        this._tapService.vote(this.tapSession.SessionId, vote)
            .switchMap(() => this._tapService.getTapContents(this.info.TapId))
            .subscribe();
    }

    editTapScale() {
        this.originalScale = this.tapSession.Keg.Beer.LabelScalingFactor;
        this.editing = true;
    }

    cancelTapScale() {
        this.editing = false;
        this.tapSession.Keg.Beer.LabelScalingFactor = this.originalScale;
    }

    submitTapScale() {
        if (!this.tapSession || !this.tapSession.Keg || !this.tapSession.Keg.Beer) {
            return;
        }
        this.editing = false;
        let beer = this.tapSession.Keg.Beer;
        this._adminService.saveBeerLabelScale(beer.BeerId, beer.LabelScalingFactor).subscribe();
    }
}
