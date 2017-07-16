import { NgbDateHelper } from '../../../helpers/ngb_date';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as Moment from 'moment';

@Component({
    selector: 'date-range',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})

export class DateRangeComponent implements OnInit {
    @Input() fromDate: NgbDateStruct;
    @Input() toDate: NgbDateStruct;
    @Output() change = new EventEmitter();

    constructor(private _datepickerConfig: NgbDatepickerConfig) {
        _datepickerConfig.maxDate = NgbDateHelper.currentDate();
        _datepickerConfig.minDate = NgbDateHelper.minDate();
    }

    ngOnInit() { }

    onFromDateChange(newDate: NgbDateStruct) {
        this.fromDate = newDate;

        if (this.fromDate && this.toDate 
            && new Date(NgbDateHelper.dateToString(this.fromDate)) > new Date(NgbDateHelper.dateToString(this.toDate))) {
            this.onToDateChange(newDate);
        }

        this.change.emit({fromDate: this.fromDate, toDate: this.toDate});
    }

    onToDateChange(newDate: NgbDateStruct) {
        this.toDate = newDate;

        if (this.toDate && this.fromDate 
            && new Date(NgbDateHelper.dateToString(this.toDate)) < new Date(NgbDateHelper.dateToString(this.fromDate))) {
            this.onFromDateChange(newDate);
        }

        this.change.emit({fromDate: this.fromDate, toDate: this.toDate});
    }

    dateToString(date) {
        return NgbDateHelper.dateToString(date);
    }
}
