import {Component, OnDestroy, OnInit} from '@angular/core';
import {TapService} from '../../services/tap.service';
import {Tap} from '../../models/tap.model';
import {StatsService} from '../../services/stats.service';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TapSession} from '../../models/session.model';
import * as Moment from 'moment';
import { NgbDateHelper } from "../../helpers/ngb_date";

@Component({
    selector: 'stats',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    taps: Tap[];
    pourData: any[];
    sessionData: TapSession[];
    pourSessionData: TapSession[];

    fromDate: NgbDateStruct;
    toDate: NgbDateStruct;

    showFilters: boolean = false;

    constructor(
        private _tapService: TapService,
        private _statsService: StatsService
    ) {
        this.toDate = Object.assign({}, NgbDateHelper.currentDate());
        this.fromDate = NgbDateHelper.momentToDate(Moment().subtract(2, 'w'));
    }

    ngOnInit() {
        this._tapService.getTaps().subscribe(taps => this.taps = taps);

        this.subscriptions.push(this._statsService.observePours().subscribe(pours => this.pourData = pours.filter(x => x.Volume < 1000)));
        this.subscriptions.push(this._statsService.observeSessions().subscribe(sessions => this.sessionData = sessions));

        this._statsService.getSessions(NgbDateHelper.dateToString(NgbDateHelper.minDate()), NgbDateHelper.dateToString(this.toDate, true))
            .do(sessions => {
                let earliestActiveSession:TapSession = sessions.filter(s => s.Active).reduce((prev, curr) => {
                    if(!prev || Moment(curr.TappedTime).isBefore(prev.TappedTime)) {
                        return curr;
                    }
                    return prev;
                });

                this.fromDate = NgbDateHelper.momentToDate(Moment(earliestActiveSession.TappedTime));

                this.trySubmitDateRange({fromDate: this.fromDate, toDate: this.toDate});
            })
            .subscribe();
    }

    filterForKeg(session: TapSession) {
        this.fromDate = NgbDateHelper.momentToDate(Moment(session.TappedTime));
        this.toDate = NgbDateHelper.momentToDate(session.RemovalTime ? Moment(session.RemovalTime) : Moment());

        this.trySubmitDateRange({fromDate: this.fromDate, toDate: this.toDate});
    }

    trySubmitDateRange(range) {
        this.fromDate = range.fromDate;
        this.toDate = range.toDate;

        if (!(this.fromDate && this.toDate)) {
            return;
        }

        this._statsService.getPours(NgbDateHelper.dateToString(this.fromDate), NgbDateHelper.dateToString(this.toDate, true))
            .subscribe(_ => {
                this.pourSessionData =
                    this.sessionData.filter(s => Moment(s.TappedTime) >= Moment(NgbDateHelper.dateToString(this.fromDate))
                        && Moment(s.TappedTime) < Moment(NgbDateHelper.dateToString(this.toDate)));
            });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
