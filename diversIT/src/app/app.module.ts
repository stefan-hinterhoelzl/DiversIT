import { ForumComponent } from './forum/forum.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MissionComponent } from './landing-page/landing-page-components/mission/mission.component';
import { MentorSpotlightComponent } from './landing-page/landing-page-components/mentor-spotlight/mentor-spotlight.component';
import { NavbarComponent } from './landing-page/landing-page-components/navbar/navbar.component';
import { StickyNavModule } from 'ng2-sticky-nav';
import { JobProfilesComponent } from './landing-page/landing-page-components/job-profiles/job-profiles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileCardComponent } from './main/main-components/left-panel/profile-card/profile-card.component';
import { ChatComponent } from './chat/chat.component';
import { LeftSpacerComponent } from './profile-page/left-spacer/left-spacer.component';
import { RightSpacerComponent } from './profile-page/right-spacer/right-spacer.component';
import { MainPanelComponent } from './profile-page/main-panel/main-panel.component';
import { RightPanelProfileComponent } from './profile-page/right-panel/right-panel.component';
import { ProfileHeadComponent } from './profile-page/main-panel/profile-head/profile-head.component';
import { ProfileNewPostComponent } from './profile-page/main-panel/profile-new-post/profile-new-post.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { FooterComponent } from './footer/footer.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { DialogComponent } from './dialog/dialog.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserRatingsComponent } from './landing-page/landing-page-components/user-ratings/user-ratings.component';
import { RatingComponent } from './profile-page/right-panel/rating/rating.component';
import { StarRatingComponent } from './profile-page/right-panel/rating/star-rating/star-rating.component';
import { RelationsPageComponent } from './relations-page/relations-page.component';
import { ForumThreadComponent } from './forum-thread/forum-thread.component';
import { ThreadOverviewComponent } from './forum/thread-overview/thread-overview.component';
import { SearchFilterSortComponent } from './forum/search-filter-sort/search-filter-sort.component';
import { PageSelectionComponent } from './forum/page-selection/page-selection.component';
import { MessageCardComponent } from './forum-thread/message-card/message-card.component';
import { SearchComponent } from './search/search.component';

/** instance of firebase */
const app = initializeApp(environment.firebaseConfig);

/**
 * NgModules configure the injector and the compiler and help organize related things together.
 *
 * @export
 * @class AppModule
 */
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
    MissionComponent,
    MentorSpotlightComponent,
    JobProfilesComponent,
    ProfileCardComponent,
    ChatComponent,
    LeftSpacerComponent,
    RightSpacerComponent,
    MainPanelComponent,
    RightPanelProfileComponent,
    ProfileHeadComponent,
    ProfileNewPostComponent,
    FooterComponent,
    ImprintComponent,
    PrivacyComponent,
    ProfileSettingsComponent,
    DialogComponent,
    NotificationsComponent,
    UserRatingsComponent,
    RatingComponent,
    StarRatingComponent,
    RelationsPageComponent,
    ForumComponent,
    ForumThreadComponent,
    ThreadOverviewComponent,
    SearchFilterSortComponent,
    PageSelectionComponent,
    MessageCardComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    StickyNavModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NgxScrollTopModule,
  ],
  providers: [SnackbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(firestore: UserService, auth: AuthService, database: ChatService) { }
}
