import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {VotesComponent} from '../components/votes';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: '', component: VotesComponent},
            ]
        )
    ],
    declarations: [
        VotesComponent,
    ],
    exports: [
        VotesComponent,
    ]
})
export class LazyVotesModule { }
