import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from 'firebase/auth';
import { FirestoreService } from '../services/firestore.service';
import { Subscription } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { DiversITUser } from '../models/users.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  currentUser: DiversITUser;
  currentUserSubscription: Subscription;

  constructor(private firestore: FirestoreService, private auth: AuthService) { }


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
    this.firestore.addRelationship("f0fi5AyuXMSlFcmmJTzErrRqFvx1", this.currentUser.uid);
  }

}