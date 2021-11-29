import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiversITUser } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';
import { ObserversService } from 'src/app/services/observers.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  currentUser: DiversITUser
  currentUserSubscription: Subscription

  constructor(private viewportScroller: ViewportScroller, private firestore: UserService, private auth: AuthService, private observer: ObserversService) { }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((data) => {
      this.currentUser = data;
      if(data != null) {
        this.loginApplied = false;
      }
    });
  }



  public onClick(elementId: string): void {
    this.viewportScroller.setOffset([0, 72.5])
    this.viewportScroller.scrollToAnchor(elementId);
    
  }

  classApplied = false;
  loginApplied = false;

  toggleClass() {
    this.classApplied = !this.classApplied;
  }

  toggleLogin() {
    this.loginApplied = !this.loginApplied;
  }

  logout() {
    this.auth.logout();
  }
}
