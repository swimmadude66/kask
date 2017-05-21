import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {StatsComponent, KegsChartComponent, TapsChartComponent} from '../components/stats';
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
        TapsChartComponent,
        KegsChartComponent
    ],
    exports: [
        StatsComponent,
        TapsChartComponent,
        KegsChartComponent
    ]
})
export class LazyStatsModule { }
