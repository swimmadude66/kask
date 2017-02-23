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
    private editing: boolean;

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
        } else {
            this.editing = true;
            this.loaded = true;
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

    private addTap() {
        this._tapService.addTap(this.info)
        .subscribe(
            id => {
                this.info.TapId = id;
                this.editing = false;
            }, err => console.log(err)
        );
    }

    private editTap() {
        this._tapService.updateTap(this.info)
        .subscribe(
            success => {
                this.editing = false;
            }, err => console.log(err)
        );
    }

    private submitTap() {
        if (this.info && this.info.TapId) {
            this.editTap();
        } else {
            this.addTap();
        }
    }
}
