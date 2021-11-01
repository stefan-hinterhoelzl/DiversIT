import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from 'firebase/auth';
import {CUser, OUser} from '../models/users.model'
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  currentUser: CUser;

  constructor(private firestore: FirestoreService, private auth: AuthService) { }

  ngOnInit(): void {
    this.firestore.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
      }
    });

  }

  logout() {
    this.auth.logout();
  }

}