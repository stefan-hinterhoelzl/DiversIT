import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material-module';
import { initializeApp } from '@firebase/app';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginBoxComponent } from './login-box/login-box.component';
import { MainComponent } from './main/main.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  } from 'angularx-social-login'

const app = initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginBoxComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    SocialLoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
