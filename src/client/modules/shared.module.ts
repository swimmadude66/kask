import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {ParallaxScrollDirective} from '../directives';
import {ChalkboardBottomComponent} from '../components/app/chalkboard_bottom/component';
import {KegProgressComponent} from '../components/shared/keg_progress_bar/component';

@NgModule({
    imports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule
    ],
    declarations: [
        ParallaxScrollDirective,
        ChalkboardBottomComponent,
        KegProgressComponent
    ],
    exports: [
        HttpModule,
        FormsModule,
        CommonModule,
        RouterModule,
        ParallaxScrollDirective,
        ChalkboardBottomComponent,
        KegProgressComponent
    ]
})
export class SharedModule { }
