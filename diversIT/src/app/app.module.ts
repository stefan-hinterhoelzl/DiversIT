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
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ServicesComponent } from './landing-page/landing-page-components/services/services.component';
import { TeamComponent } from './landing-page/landing-page-components/team/team.component';
import { MentorSpotlightComponent } from './landing-page/landing-page-components/mentor-spotlight/mentor-spotlight.component';
import { NavbarComponent } from './landing-page/landing-page-components/navbar/navbar.component';
import { StickyNavModule } from 'ng2-sticky-nav';
import { JobProfilesComponent } from './landing-page/landing-page-components/job-profiles/job-profiles.component';
import { JobCardComponent } from './landing-page/landing-page-components/job-profiles/job-card/job-card.component';

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
    RightPanelComponent,
    AdminPageComponent,
    UnauthorizedComponent,
    NavbarComponent,
    ServicesComponent,
    TeamComponent,
    MentorSpotlightComponent,
    JobProfilesComponent,
    JobCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    StickyNavModule
  ],
  providers: [SnackbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
