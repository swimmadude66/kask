import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as Moment from 'moment';

@Injectable()
export class NgbDateHelper {

    constructor() { }

    public static momentToDate(moment: any): NgbDateStruct {
        return {year: moment.year(), month: moment.month() + 1, day: moment.date()};
    }

    public static dateToString(date: NgbDateStruct, nextDay = false) {
        let  m = Moment({day: date.day, month: date.month - 1, year: date.year});

        if (nextDay) {
            m.add(1, 'd');
        }
        return m.format('YYYY-MM-DD');
    }

    public static minDate() {
        return NgbDateHelper.momentToDate(Moment().subtract(1, 'year'));
    }
    public static currentDate() {
        return NgbDateHelper.momentToDate(Moment());
    }
}
