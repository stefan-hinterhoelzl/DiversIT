import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { DiversITUser } from './models/users.model';
import { Location } from '@angular/common';
import { ChatService } from './services/chat.service';
import { ObserversService } from './services/observers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mintistcool';
  currentUser: DiversITUser;
  newMessages: number;

  constructor(private router: Router, private auth: AuthService, private firestore: UserService, private location: Location, private chat: ChatService, private observer: ObserversService) {
  }


  ngOnInit(): void {
    this.observer.currentUserStatus.subscribe((data) => {
      this.currentUser = data;
    })

    this.observer.numberStatus.subscribe((data) => {
      this.newMessages = data;
    });

  }

  isLandingPage() {
    return this.router.url == '/landing';
  }

  isLegalPage() {
    return this.router.url == '/impressum' || this.router.url == '/datenschutz';
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
