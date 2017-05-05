import {TapService} from '../../../services/tap.service';
import {Tap} from '../../../models';
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TapSession} from "../../../models/session.model";
import {Observable} from "rxjs/Rx";

@Component({
    selector: 'tap',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapComponent implements OnInit {
    
    tapSession: TapSession;
    loaded: boolean;
    editing: boolean = false;

    //TODO: pull from flow sensors
    private percentFull: number = Math.random()*100;

    @Input() info: Tap;
    @Input() tapNum: number;
    @Input() isLoggedIn: boolean;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        if (this.info && this.info.TapId) {
            this._tapService.observeTapContents(this.info.TapId).subscribe(
                tapSession => this.tapSession = tapSession,
                error => console.log(error),
                () => this.loaded = true
            );

            //poll the tap
            Observable.timer(0, 30000)
                .switchMap(() => this._tapService.getTapContents(this.info.TapId))
                .subscribe();
        } else {
            this.editing = true;
            this.loaded = true;
        }
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

    getPercentFull() {
        // min of 3% in case the flow sensor data predicts a premature kick.
        return Math.max((1 - (this.tapSession.Keg.RemovedVolume/this.tapSession.Keg.InitialVolume))*100, 3);
    }
    

    vote(vote: string) {
        this._tapService.vote(this.tapSession.SessionId, vote)
            .switchMap(() => this._tapService.getTapContents(this.info.TapId))
            .subscribe();
    }

    addTap() {
        this._tapService.addTap(this.info)
        .subscribe(
            id => {
                this.info.TapId = id;
                this.editing = false;
            }, err => console.log(err),
            () => this.loaded = true
        );
    }

    editTap() {
        this._tapService.updateTap(this.info)
        .subscribe(
            success => {
                this.editing = false;
            }, err => console.log(err),
            () => this.loaded = true
        );
    }

    submitTap() {
        this.loaded = false;
        if (this.info && this.info.TapId) {
            this.editTap();
        } else {
            this.addTap();
        }
    }

    deleteTap() {
        if (this.info && this.info.TapId) {
            this.loaded = false;
            this._tapService.deleteTap(this.info.TapId)
            .subscribe(
                success => this.remove.emit(this.info.TapId),
                err => console.log(err),
                () => this.loaded = true
            );
        }
    }
}
