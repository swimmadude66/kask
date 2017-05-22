import {Component, OnDestroy, OnInit} from '@angular/core';
import {TapService} from "../../services/tap.service";
import {Tap} from "../../models/tap.model";
import {StatsService} from "../../services/stats.service";
import {NgbDatepickerConfig, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {TapSession} from "../../models/session.model";
import * as Moment from 'moment';

@Component({
    selector: 'stats',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    private taps: Tap[];
    private pourData: any[];
    private sessionData: TapSession[];
    
    private fromDate: NgbDateStruct;
    private toDate: NgbDateStruct;

    private showFilters: boolean = false;
    
    constructor(
        private _tapService: TapService,
        private _statsService: StatsService,
        private _datepickerConfig: NgbDatepickerConfig
    ) {
        _datepickerConfig.maxDate = this.momentToDate(Moment());

        this.toDate = Object.assign({}, _datepickerConfig.maxDate);
        this.fromDate = this.momentToDate(Moment().subtract(2, 'w'));
    }

    ngOnInit() {
        this._tapService.getTaps().subscribe(taps => {
            this.taps = taps;
        });
        
        this._statsService.observePours().subscribe(pours => this.pourData = pours.filter(x => x.Volume < 1000));
        this._statsService.observeSessions().subscribe(sessions => this.sessionData = sessions);
        
        this._statsService.getPours(this.dateToString(this.fromDate), this.dateToString(this.toDate)).subscribe();
        this._statsService.getSessions(Moment().subtract(1, 'y').format('YYYY-MM-DD'), this.dateToString(this.toDate, true)).subscribe();
    }

    filterForKeg(session: TapSession) {
        this.fromDate = this.momentToDate(Moment(session.TappedTime.slice(0, -1)));
        this.toDate = this.momentToDate(session.RemovalTime ? Moment(session.RemovalTime.slice(0, -1)) : Moment());

        this.trySubmitDateRange();
    }


    onFromDateChange(newDate: NgbDateStruct) {
        this.fromDate = newDate;

        if (this.fromDate && this.toDate && new Date(this.dateToString(this.fromDate)) > new Date(this.dateToString(this.toDate))) {
            this.onToDateChange(newDate);
        }

        this.trySubmitDateRange();
    }

    onToDateChange(newDate: NgbDateStruct) {
        this.toDate = newDate;

        if (this.toDate && this.fromDate && new Date(this.dateToString(this.toDate)) < new Date(this.dateToString(this.fromDate))) {
            this.onFromDateChange(newDate);
        }

        this.trySubmitDateRange();
    }

    trySubmitDateRange() {
        if(!(this.fromDate && this.toDate))
            return;

        this._statsService.getPours(this.dateToString(this.fromDate), this.dateToString(this.toDate, true))
            .subscribe();
    }

    private momentToDate(moment: any): NgbDateStruct {
        return {year: moment.year(), month: moment.month() + 1, day: moment.date()};
    }

    private dateToString(date: NgbDateStruct, nextDay: boolean = false) {
        var m = Moment({day: date.day, month: date.month - 1, year: date.year});
        if (nextDay) {
            m.add(1, 'd');
        }
        return m.format('YYYY-MM-DD');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
