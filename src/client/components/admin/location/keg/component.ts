import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {AdminService} from "../../../../services/admin.service";
import {Keg} from "../../../../models/keg.model";
import {Tap} from "../../../../models/tap.model";

@Component({
    selector: 'keg-move',
    templateUrl: './template.html',
    styleUrls: ['../../../styles.scss', './styles.scss']
})
export class KegRowComponent implements OnInit {

    @Input() info: Keg;
    @Input() taps: Tap[];
    
    selectedTapId: number = null;
    
    constructor(
        private _adminService: AdminService
    ) { }

    ngOnInit() {
       
    }
    
    tapKeg() {
        if(!!this.selectedTapId) {
            this._adminService.loadTapFromStorage(this.selectedTapId, this.info.KegId).subscribe();
        }
    }
}
