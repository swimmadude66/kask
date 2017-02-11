import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../components/';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    RouterModule.forRoot(
      [
        { path: '', loadChildren: './+dashboard.module.ts#LazyDashboardModule' },
      ]
    )
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
