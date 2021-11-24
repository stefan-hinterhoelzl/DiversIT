import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from 'firebase/auth';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DiversITUser } from '../models/users.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  currentUser: DiversITUser;
  currentUserSubscription: Subscription;

  constructor(private firestore: UserService, private auth: AuthService, private rtdb: ChatService) { }


  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.firestore.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
      }
    });

  }

  logout() {
    this.auth.logout();
  }

  addRelationship() {
    this.rtdb.addRelationship("mBEqh7GLs7RMXmEcL5u5dszw3p53", this.currentUser.uid);
  }

}