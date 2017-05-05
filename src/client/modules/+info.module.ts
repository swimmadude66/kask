import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {BeerInfoComponent} from '../components/info/beer/component';
import {BreweryInfoComponent} from '../components/info/brewery/component';
import {StyleInfoComponent} from '../components/info/style/component';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: 'beer/:id', component: BeerInfoComponent},
                {path: 'brewery/:id', component: BreweryInfoComponent},
                {path: 'style/:id', component: StyleInfoComponent},
            ]
        )
    ],
    declarations: [
        BeerInfoComponent,
        BreweryInfoComponent,
        StyleInfoComponent
    ],
    exports: [
        BeerInfoComponent,
        BreweryInfoComponent,
        StyleInfoComponent
    ]
})
export class LazyInfoModule { }
