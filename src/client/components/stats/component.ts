import {Component, OnDestroy, OnInit} from '@angular/core';
import {TapService} from "../../services/tap.service";
import {Tap} from "../../models/tap.model";
import {StatsService} from "../../services/stats.service";
import {NgbDatepickerConfig, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'stats',
    templateUrl: './template.html',
    styleUrls: ['../styles.scss', './styles.scss']
})
export class StatsComponent implements OnInit, OnDestroy {
    private subscriptions = [];

    private taps: Tap[];
    private pourData: any[];

    private fromDate: NgbDateStruct;
    private toDate: NgbDateStruct;

    constructor(
        private _tapService: TapService,
        private _statsService: StatsService,
        private _datepickerConfig: NgbDatepickerConfig
    ) {
        let now = new Date();
        _datepickerConfig.maxDate = {year: now.getFullYear(), month: now.getMonth()+1, day: now.getDate()};

        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        this.toDate = { year: now.getFullYear(), month: now.getMonth()+1, day: now.getDate() };
        this.fromDate = { year: sevenDaysAgo.getFullYear(), month: sevenDaysAgo.getMonth()+1, day: sevenDaysAgo.getDate() };
    }

    ngOnInit() {
        this._tapService.getTaps().subscribe(taps => {
            this.taps = taps;
        });

        this._statsService.observePours().subscribe(pours => {
            this.pourData = pours.filter(x => x.Volume < 1000).map(p => {
                let dt = new Date(p.Timestamp.slice(0, -1));
                p.Date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                p.Volume = Math.ceil(p.Volume / 29.57);
                return p;
            });
        });

        this._statsService.getPours().subscribe();
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

        this._statsService.getPours(this.dateToString(this.fromDate), this.dateToString(this.toDate))
            .subscribe();
    }

    private dateToString(date: NgbDateStruct) {
        let pad = (num: number): string => {
            if (num > 9) {
                return '' + num;
            }
            return '0' + num;
        };

        return date ? `${date.year}-${pad(date.month)}-${pad(date.day)}` : null;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
