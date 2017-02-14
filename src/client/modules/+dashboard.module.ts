import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {DashboardComponent, TapComponent} from '../components';

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
        TapComponent
    ],
    exports: [
        DashboardComponent,
        TapComponent,
    ]
})
export class LazyDashboardModule { }
