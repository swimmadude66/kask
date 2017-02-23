import {TapService} from '../../../services/tap.service';
import {Tap, Keg} from '../../../models';
import {Component, Input, OnInit} from '@angular/core';

const BEER_IMG = 'assets/img/beer.jpg';

@Component({
    selector: 'tap',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapComponent implements OnInit {

    private contents: Keg;
    private loaded: boolean;

    @Input() info: Tap;

    constructor(
        private _tapService: TapService
    ) { }

    ngOnInit() {
        if (this.info && this.info.TapId) {
            this._tapService.getTapContents(this.info.TapId).subscribe(
                beer => this.contents = beer,
                error => console.log(error),
                () => this.loaded = true
            );
        }
    }
}
