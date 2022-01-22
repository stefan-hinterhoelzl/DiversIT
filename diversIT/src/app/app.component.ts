import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DiversITUser } from './models/users.model';
import { Location } from '@angular/common';
import { ObserversService } from './services/observers.service';
import { Subscription } from 'rxjs';
import { LoadingService } from './services/loading.service';

/**
 * root file of the whole app. Main purpose is to load correct components and take care of routing through the application.
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mintistcool';
  currentUser: DiversITUser;
  newMessages: number;
  newNotifications: number;
  currentUserSubscription: Subscription;
  currentChatSubscripton: Subscription;
  currentNotSubscription: Subscription;
  loading = this.loader.loading$;



  /**
   * Creates an instance of AppComponent.
   * @param {Router} router adds a router object to this file which is used for routing
   * @param {AuthService} auth adding the authentication service to the application
   * @param {Location} location
   * @param {ObserversService} observer
   * @param {LoadingService} loader
   * @memberof AppComponent
   */
  constructor(private router: Router, private auth: AuthService, private location: Location, private observer: ObserversService, private loader: LoadingService) {
  }


  /**
   * unsubribes all subscriptions when maincomponent gets destroyed
   *
   * @memberof AppComponent
   */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe()
    this.currentChatSubscripton.unsubscribe()
    this.currentNotSubscription.unsubscribe()
  }


  /**
   * adds subscription for the currentuser navigating the application, the chat of said user and the notifications of the user. 
   * 
   * This is necessary as the badges with the unread notifications/chat messages are shown in the navbar
   *
   * @memberof AppComponent
   */
  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((data) => {
      this.currentUser = data;
    })

    this.currentChatSubscripton = this.observer.numberStatus.subscribe((data) => {
      this.newMessages = data;
    });

    this.currentNotSubscription = this.observer.notificationsOfUserStatus.subscribe((data) => {
      if (data != null)
        this.newNotifications = data.length
    })

    //TODO: Add profilsettings check and Snackbar
  }

  /** return true or false, depending on the route of the page (true when the route ist /landing) */
  isLandingPage() {
    return this.router.url == '/landing';
  }

  /** return true or false, depending on the route of the page */
  isLegalOrForumPage() {
    return this.router.url == '/impressum' || this.router.url == '/datenschutz' || this.router.url.startsWith('/forum');
  }

  /** logs out the user, this will lead to a redirect if the currentuser is at a route which is guarded for only authenticated users. */
  logout() {
    this.auth.logout();
  }


  /**
   * activates by clicking on the home button(logo) 
   * 
   * navigates the user to /app. If the user is already there, the page will be refreshed
   */
  diversIT() {
    if (this.router.url === '/app') {
      window.location.reload();
    }
    else {
      this.router.navigate(['/app'])
    }
  }

  /** navigates the user back. Used on pages which have no normal navbar.  */
  back() {
    this.location.back();
  }
}
