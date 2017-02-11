import { Component } from '@angular/core';

@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})
export class DashboardComponent {
    private taps = [{
        Name: 'Tap 1',
        Description: 'IPAs mostly',
        Beer: {
            Name: 'Scrimshaw Pilsner',
            ABV: '4.5%',
            IBU: '20',
            Style: 'Pilsner',
            BA: 'N/A'
        }
    }];

    constructor() {}
}
