import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {DashboardComponent, TapComponent} from '../components/dashboard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: '', component: DashboardComponent},
            ]
        ),
        NgbModule.forRoot(),
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
