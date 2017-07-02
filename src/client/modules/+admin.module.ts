import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {AdminComponent} from '../components/admin';
import {LocationComponent} from '../components/admin/location/component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TapEditComponent} from '../components/admin/tap/component';
import {KegRowComponent} from '../components/admin/keg/component';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: '', component: AdminComponent},
            ]
        ),
        NgbModule.forRoot(),
    ],
    declarations: [
        AdminComponent,
        LocationComponent,
        TapEditComponent,
        KegRowComponent
    ],
    exports: [
        AdminComponent,
        LocationComponent,
        TapEditComponent,
        KegRowComponent
    ]
})
export class LazyAdminModule { }
