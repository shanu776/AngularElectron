import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import { NgxElectronModule } from 'ngx-electron';
import { Ng2AutoCompleteModule} from 'ng2-auto-complete'
import { NguiAutoCompleteModule } from '@ngui/auto-complete'
import { HotkeyModule } from 'angular2-hotkeys'
import { TabModule } from 'angular-tabs-component'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { FocusDirective, FocusNextDirective } from './focus.directive';
import { ProductComponent } from './product/product.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfigurationComponent,
    FocusDirective,
    FocusNextDirective,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgxElectronModule,
    Ng2AutoCompleteModule,
    NguiAutoCompleteModule,
    TabModule,
    HotkeyModule.forRoot(),
    RouterModule.forRoot([
      {path:"",redirectTo:"/home/",pathMatch:"full"},
      { path:"home/:id",component:HomeComponent},
      { path:"configuration",component:ConfigurationComponent},
      { path:"product",component:ProductComponent}
    ])
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
