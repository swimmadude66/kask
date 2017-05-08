import {Component, Input} from "@angular/core";
import {Keg} from "../../../models/keg.model";

@Component({
    selector: 'keg-progress-bar',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class KegProgressComponent {

    @Input() keg: Keg;

    getPercentFull() {
        // min of 3% in case the flow sensor data predicts a premature kick.
        return Math.max((1 - (this.keg.RemovedVolume/this.keg.InitialVolume))*100, 3);
    }
}
