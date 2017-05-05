import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {DashboardComponent, TapComponent} from '../components/dashboard';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
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
        TapComponent
    ]
})
export class LazyDashboardModule { }
