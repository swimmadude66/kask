import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {DashboardComponent} from '../components/dashboard';

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
    ],
    exports: [
        DashboardComponent,
    ]
})
export class LazyDashboardModule { }
