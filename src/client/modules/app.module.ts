import {ALL_PROVIDERS} from '../services';
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
          { path: 'stats', loadChildren: './+stats.module.ts#LazyStatsModule' },
          { path: 'votes', loadChildren: './+votes.module.ts#LazyVotesModule' },
      ]
    )
  ],
  declarations: [
    AppComponent,
  ],
  providers: ALL_PROVIDERS,
  bootstrap: [AppComponent]
})
export class AppModule { }
