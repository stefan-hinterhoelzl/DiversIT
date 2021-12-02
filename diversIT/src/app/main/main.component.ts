import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from 'firebase/auth';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DiversITUser } from '../models/users.model';
import { ChatService } from '../services/chat.service';
import { ObserversService } from '../services/observers.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  currentUser: DiversITUser;
  currentUserSubscription: Subscription;

  constructor(private firestore: UserService, private auth: AuthService, private rtdb: ChatService, private observer: ObserversService) { }


  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
      }
    });

  }

  logout() {
    this.auth.logout();
  }

}