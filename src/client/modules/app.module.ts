import {ALL_PROVIDERS} from '../services';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../components/';
import {SharedModule} from './shared.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    SharedModule,
    RouterModule.forRoot(
      [
          { path: '', loadChildren: './+dashboard.module.ts#LazyDashboardModule' },
          { path: 'stats', loadChildren: './+stats.module.ts#LazyStatsModule' },
          { path: 'votes', loadChildren: './+votes.module.ts#LazyVotesModule' },
          { path: 'info', loadChildren: './+info.module.ts#LazyInfoModule' },
          { path: 'user', loadChildren: './+user.module.ts#LazyUserModule'}
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
