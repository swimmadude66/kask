import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';

import {LocationComponent, TapComponent, TapImageComponent} from '../components/dashboard';

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
        TapImageComponent
    ],
    exports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule,
        LocationComponent,
        TapComponent,
        TapImageComponent
    ]
})
export class SharedModule { }
