import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {AdminComponent, TapFormComponent, LocationFormComponent} from '../components/admin';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(
            [
                {path: '', component: AdminComponent},
            ]
        )
    ],
    declarations: [
        AdminComponent,
        TapFormComponent,
        LocationFormComponent,
    ],
    exports: [
        AdminComponent,
        TapFormComponent,
        LocationFormComponent,
    ]
})
export class LazyAdminModule { }
