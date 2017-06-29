import {AdminService} from '../../../services/admin.service';
import {TapService} from '../../../services/tap.service';
import {Tap, TapSession} from '../../../models';
import {Component, Input, OnInit, Output, EventEmitter, OnDestroy, HostListener, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'tap',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    tapSession: TapSession;
    loaded: boolean;
    editing = false;
    originalScale = 100;
    originalOffsetX = 0;
    originalOffsetY = 0;
    isMovingImage = false;
    lastMouseEvent: MouseEvent;
    isPouring = false;
    amountPoured: string;

    @Input() info: Tap;
    @Input() tapNum: number;
    @Input() isLoggedIn: boolean;
    @Input() isAdmin: boolean;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if(this.isMovingImage) {
            this.tapSession.Keg.Beer.LabelOffsetX += event.clientX - this.lastMouseEvent.clientX;
            this.tapSession.Keg.Beer.LabelOffsetY += event.clientY - this.lastMouseEvent.clientY;

            this.lastMouseEvent = event;
        }
    }

    @HostListener('mouseup')
    onMouseup() {
        this.isMovingImage = false;
    }

    @ViewChild('pourAmount') pourAmountTooltip: NgbTooltip;

    constructor(
        private _tapService: TapService,
        private _adminService: AdminService
    ) { }

    ngOnInit() {
        if (this.info && this.info.TapId) {
            this.subscriptions.push(
                this._tapService.observeTapContents(this.info.TapId)
                .merge(this._tapService.getTapContents(this.info.TapId))
                .subscribe(
                    tapSession => this.tapSession = tapSession,
                    error => console.error(error),
                    () => this.loaded = true
            ));

            this.subscriptions.push(
                this._tapService.observeTapPours(this.info.TapId)
                .subscribe(pour => this.handlePour(pour))
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

    dragImageStart(event: MouseEvent) {
        if (this.editing) {
            this.isMovingImage = true;
            this.lastMouseEvent = event;
        }
    }

    vote(vote: string) {
        if (this.tapSession && this.tapSession.UserVote) {
            if (((this.tapSession.UserVote === 1) && (vote === 'up')) || ((this.tapSession.UserVote === -1) && (vote === 'down'))) {
                vote = 'none';
            }
        }

        let voteNum = vote === 'none' ? 0 : vote === 'down' ? -1 : 1;

        this._tapService.vote(this.info.TapId, vote).subscribe(_ => this.tapSession.UserVote = voteNum);
    }

    editTapImage() {
        this.originalScale = this.tapSession.Keg.Beer.LabelScalingFactor;
        this.originalOffsetX = this.tapSession.Keg.Beer.LabelOffsetX;
        this.originalOffsetY = this.tapSession.Keg.Beer.LabelOffsetY;
        this.editing = true;
    }

    cancelTapScale() {
        this.editing = false;
        this.tapSession.Keg.Beer.LabelScalingFactor = this.originalScale;
        this.tapSession.Keg.Beer.LabelOffsetX = this.originalOffsetX;
        this.tapSession.Keg.Beer.LabelOffsetY = this.originalOffsetY;
    }

    submitTapScale() {
        if (!this.tapSession || !this.tapSession.Keg || !this.tapSession.Keg.Beer) {
            return;
        }
        this.editing = false;
        let beer = this.tapSession.Keg.Beer;
        this._adminService.saveBeerLabelImage(beer.BeerId, this.tapSession.TapId, beer.LabelScalingFactor, beer.LabelOffsetX, beer.LabelOffsetY).subscribe();
    }

    handlePour(pour) {
         this.isPouring = pour.isPouring;

         if (!this.isPouring && pour.volume) {
             Observable.timer(300)
             .do(_ => {
                this.amountPoured = (pour.volume / 29.5735).toFixed(2);
                this.pourAmountTooltip.open();
             })
            .delay(2000)
            .subscribe(_ => this.pourAmountTooltip.close());
         }
    }
}
