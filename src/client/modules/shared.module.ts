import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';

import {LocationComponent, TapComponent} from '../components/dashboard';

@NgModule({
    imports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule
    ],
    declarations: [
        LocationComponent,
        TapComponent,
    ],
    exports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule,
        LocationComponent,
        TapComponent,
    ]
})
export class SharedModule { }
