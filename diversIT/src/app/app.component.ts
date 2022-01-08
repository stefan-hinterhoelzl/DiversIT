import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { DiversITUser } from './models/users.model';
import { Location } from '@angular/common';
import { ChatService } from './services/chat.service';
import { ObserversService } from './services/observers.service';
import { Subscription } from 'rxjs';
import { LoadingService } from './services/loading.service';

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

  constructor(private router: Router, private auth: AuthService, private firestore: UserService, private location: Location, private chat: ChatService, private observer: ObserversService, private loader: LoadingService) {
  }


  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe()
    this.currentChatSubscripton.unsubscribe()
    this.currentNotSubscription.unsubscribe()
  }


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
  }

  isLandingPage() {
    return this.router.url == '/landing';
  }

  isLegalOrForumPage() {
    return this.router.url == '/impressum' || this.router.url == '/datenschutz' || this.router.url.startsWith('/forum');
  }

  logout() {
    this.auth.logout();
  }

  diversIT() {
    if (this.router.url === '/app') {
      window.location.reload();
    }
    else {
      this.router.navigate(['/app'])
    }
  }

  back() {
    this.location.back();
  }
}
