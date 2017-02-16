import {TapService} from '../../../services/tap.service';
import {Beer, Tap, KegSize} from '../../../models';
import {Component} from '@angular/core';

const BEER_IMG = 'assets/img/beer.jpg';

@Component({
    selector: 'tap-form',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class TapFormComponent {

    private info: Tap;

    constructor(
        private _tapService: TapService
    ) { }

    getImage(): string {
        return BEER_IMG;
    }
}
