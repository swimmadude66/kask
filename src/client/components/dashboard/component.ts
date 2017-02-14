import {TapService} from '../../services/tap.service';
import { Tap } from '../../models/tap.model';
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class DashboardComponent implements OnInit{
    private taps: Tap[] = [];
    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        this._tapService.getTaps()
        .subscribe(taps => this.taps = taps);
    }


}
