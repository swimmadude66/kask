import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {StatsComponent} from '../components/stats';
import {TapsChartComponent} from '../components/stats/chart/component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        ChartsModule,
        RouterModule.forChild(
            [
                {path: '', component: StatsComponent},
            ]
        )
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
