import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from 'firebase/auth';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DiversITUser } from '../models/users.model';
import { ChatService } from '../services/chat.service';
import { ObserversService } from '../services/observers.service';
import { Router } from '@angular/router';


/**
 * mainpage for Mentees, Mentors do not see this page
 *
 * @export
 * @class MainComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  /** current user navigating the application */
  currentUser: DiversITUser;
  /** subscription to said user which is globaly safed to unsubsribe when component gets destroyed */
  currentUserSubscription: Subscription;


  /**
   * Creates an instance of MainComponent.
   * @param {UserService} firestore
   * @param {AuthService} auth
   * @param {ChatService} rtdb
   * @param {ObserversService} observer
   * @memberof MainComponent
   */
  constructor(private auth: AuthService, private rtdb: ChatService, private observer: ObserversService, private snackbar: SnackbarComponent, private router: Router) { }



  /**
   * lifecycle hook - unsubscribes userobject when component is destroyed
   *
   * @memberof MainComponent
   */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }



  /**
   * lifecyclehook - subsribes to currentuser when component is first initialized
   *
   * @memberof MainComponent
   */
  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
      }

      if (this.currentUser.company == ""
      || this.currentUser.job == ""
      || this.currentUser.primaryEducation == ""
      || this.currentUser.secondaryEducation == ""
      || this.currentUser.universityEducation == ""
      || this.currentUser.gender == "") {
        let ref = this.snackbar.openSnackBar("Vervollständigen Sie bitte Ihre Profilinformationen, um die Funktionstüchtigkeit der Matching Features zu garantieren!", null, "Profileinstellungen")

        ref.onAction().subscribe(() => {
          this.router.navigate(['profilesettings'])
        })
      }

    });

  }

  /** logs the user out */
  logout() {
    this.auth.logout();
  }

}
