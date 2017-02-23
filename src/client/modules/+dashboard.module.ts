import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {DashboardComponent, LocationComponent, TapComponent} from '../components/dashboard';
import {ParallaxScrollDirective} from '../directives';

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
        LocationComponent,
        TapComponent,
        ParallaxScrollDirective
    ],
    exports: [
        DashboardComponent,
        LocationComponent,
        TapComponent,
        ParallaxScrollDirective
    ]
})
export class LazyDashboardModule { }
