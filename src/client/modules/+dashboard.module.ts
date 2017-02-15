import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {DashboardComponent, TapComponent, LocationComponent} from '../components';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(
            [
                {path: '', component: DashboardComponent},
            ]
        )
    ],
    declarations: [
        DashboardComponent,
        TapComponent,
        LocationComponent,
    ],
    exports: [
        DashboardComponent,
        TapComponent,
        LocationComponent,
    ]
})
export class LazyDashboardModule { }
