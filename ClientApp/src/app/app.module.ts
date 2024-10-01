import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { KeycloakAngularModule } from 'keycloak-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
  ],
  providers: [
    /* {
    provide: APP_INITIALIZER,
    useFactory: initKeycloak,
    multi: true,
    deps: [KeycloakService]
  }
    */
  ],
  bootstrap: [],
})
export class AppModule { }
