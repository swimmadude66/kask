import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {StatsComponent} from '../components/stats';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: '', component: StatsComponent},
            ]
        )
    ],
    declarations: [
        StatsComponent,
    ],
    exports: [
        StatsComponent,
    ]
})
export class LazyStatsModule { }
