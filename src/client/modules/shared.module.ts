import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {ParallaxScrollDirective} from '../directives';

@NgModule({
    imports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule
    ],
    declarations: [
        ParallaxScrollDirective
    ],
    exports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule,
        ParallaxScrollDirective
    ]
})
export class SharedModule { }
