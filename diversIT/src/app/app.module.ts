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
import { FlexLayoutModule } from '@angular/flex-layout';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { InterestingMentorsComponent } from './main/main-components/right-panel/interesting-mentors/interesting-mentors.component';
import { CreatingNewPostCardComponent } from './main/main-components/center-panel/creating-new-post-card/creating-new-post-card.component';
import { PostCardComponent } from './main/main-components/center-panel/post-card/post-card.component';
import { CenterPanelComponent } from './main/main-components/center-panel/center-panel.component';
import { LeftPanelComponent } from './main/main-components/left-panel/left-panel.component';
import { RightPanelComponent } from './main/main-components/right-panel/right-panel.component';

const app = initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginBoxComponent,
    MainComponent,
    SnackbarComponent,
    ProfilePageComponent,
    InterestingMentorsComponent,
    CreatingNewPostCardComponent,
    PostCardComponent,
    CenterPanelComponent,
    LeftPanelComponent,
    RightPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  providers: [SnackbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
