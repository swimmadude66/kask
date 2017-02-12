import { Tap } from '../../models/tap.model';
import { Component } from '@angular/core';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class DashboardComponent {
    private taps: Tap[] = [];
    constructor() { }
}
