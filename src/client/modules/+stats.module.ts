import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {StatsComponent} from '../components/stats';
import {TapsChartComponent} from '../components/stats/activity/component';
import { ChartsModule } from 'ng2-charts';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        ChartsModule,
        RouterModule.forChild(
            [
                {path: '', component: StatsComponent},
            ]
        ),
        NgbModule.forRoot(),
    ],
    declarations: [
        StatsComponent,
        TapsChartComponent
    ],
    exports: [
        StatsComponent,
        TapsChartComponent
    ]
})
export class LazyStatsModule { }
