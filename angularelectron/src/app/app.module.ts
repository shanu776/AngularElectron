import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { FocusDirective, FocusNextDirective } from './focus.directive';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfigurationComponent,
    FocusDirective,
    FocusNextDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxElectronModule,
    RouterModule.forRoot([
      {path:"",component:HomeComponent},
      { path:"configuration",component:ConfigurationComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
