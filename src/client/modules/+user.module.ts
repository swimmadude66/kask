import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {UserDetailComponent} from '../components/user_detail';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: '', component: UserDetailComponent},
            ]
        )
    ],
    declarations: [
        UserDetailComponent,
    ],
    exports: [
        UserDetailComponent
    ]
})
export class LazyUserModule { }
