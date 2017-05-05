import {TapService} from '../../../services/tap.service';
import {Tap} from '../../../models';
import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TapSession} from "../../../models/session.model";
import {AuthService} from "../../../services/auth.service";

const BEER_IMG = 'assets/img/beer.jpg';

@Component({
    selector: 'tap',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapComponent implements OnInit {

    private tapSession: TapSession;
    private loaded: boolean;
    private editing: boolean = false;

    //TODO: pull from flow sensors
    private percentFull: number = Math.random()*100;
    private isAuthed: boolean;

    @Input() info: Tap;
    @Input() tapNum: number;
    @Input() isLoggedIn: boolean;
    @Output() remove: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        if (this.info && this.info.TapId) {
            this._tapService.getTapContents(this.info.TapId).subscribe(
                tapSession => this.tapSession = tapSession,
                error => console.log(error),
                () => this.loaded = true
                
            );
        } else {
            this.editing = true;
            this.loaded = true;
        }
    }

    getImage(): string {
        if (this.tapSession && this.tapSession.Keg) {
            if (this.tapSession.Keg.LabelUrl) {
                return this.tapSession.Keg.LabelUrl;
            } else if (this.tapSession.Keg.Brewery && this.tapSession.Keg.Brewery.Image) {
                return this.tapSession.Keg.Brewery.Image;
            }
        }
        return BEER_IMG;
    }


    vote(vote: string) {
        this._tapService.vote(this.tapSession.SessionId, vote)
            .subscribe(
                () => this.tapSession.UserVote = vote == 'up' ? 1 : -1
            );
    }

    private addTap() {
        this._tapService.addTap(this.info)
        .subscribe(
            id => {
                this.info.TapId = id;
                this.editing = false;
            }, err => console.log(err),
            () => this.loaded = true
        );
    }

    private editTap() {
        this._tapService.updateTap(this.info)
        .subscribe(
            success => {
                this.editing = false;
            }, err => console.log(err),
            () => this.loaded = true
        );
    }

    private submitTap() {
        this.loaded = false;
        if (this.info && this.info.TapId) {
            this.editTap();
        } else {
            this.addTap();
        }
    }

    private deleteTap() {
        if (this.info && this.info.TapId) {
            this.loaded = false;
            this._tapService.deleteTap(this.info.TapId)
            .subscribe(
                success => this.remove.emit(this.info.TapId),
                err => console.log(err),
                () => this.loaded = true
            )
        }
    }
}
