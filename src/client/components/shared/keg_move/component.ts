import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Keg} from '../../../models/keg.model';
import {Tap} from '../../../models/tap.model';
import {Location} from '../../../models/location.model';

@Component({
    selector: 'keg-move',
    templateUrl: './template.html',
    styleUrls: ['../../../styles.scss', './styles.scss']
})
export class KegMoveComponent {

    @Input() info: Keg;
    @Input() taps: Tap[];
    @Input() locations: Location[];
    @Input() showClear: boolean = false;

    @Output() moveSubmitted = new EventEmitter();

    selectedDestination: string;

    constructor(
    ) { }

    moveKeg() {
        let payload = {dest: this.selectedDestination, kegId: null};
        if (this.info) {
            payload.kegId = this.info.KegId;
        }
        this.moveSubmitted.emit(payload);
    }
}
