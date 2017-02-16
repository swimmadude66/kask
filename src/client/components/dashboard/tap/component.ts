import {TapService} from '../../../services/tap.service';
import {Beer, Tap, KegSize} from '../../../models';
import {Component, Input, OnInit} from '@angular/core';

const BEER_IMG = 'assets/img/beer.jpg';

@Component({
    selector: 'tap',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapComponent implements OnInit {

    private contents: Beer & {Size?: KegSize};
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

    getImage(): string {
        if (this.contents) {
            if (this.contents.LabelUrl) {
                return this.contents.LabelUrl;
            } else if (this.contents.Brewery && this.contents.Brewery.Image) {
                return this.contents.Brewery.Image;
            }
        }
        return BEER_IMG;
    }
}
