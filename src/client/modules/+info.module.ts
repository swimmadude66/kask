import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from './shared.module';
import {BeerInfoComponent} from "../components/info/beer/component";

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(
            [
                {path: 'beer', component: BeerInfoComponent},
                // {path: 'brewery', component: BreweryInfoComponent},
                // {path: 'style', component: StyleInfoComponent},
            ]
        )
    ],
    declarations: [
        BeerInfoComponent,
        // BreweryInfoComponent,
        // StyleInfoComponent
    ],
    exports: [
        BeerInfoComponent,
        // BreweryInfoComponent,
        // StyleInfoComponent
    ]
})
export class LazyInfoModule { }
