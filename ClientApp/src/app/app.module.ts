import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { KeycloakAngularModule } from 'keycloak-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule
  ],
  providers: [
    /* {
    provide: APP_INITIALIZER,
    useFactory: initKeycloak,
    multi: true,
    deps: [KeycloakService]
  }
    */],
  bootstrap: [AppComponent]
})
export class AppModule { }
