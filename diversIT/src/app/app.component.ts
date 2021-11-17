import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';
import { DiversITUser } from './models/users.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mintistcool';
  currentUser: DiversITUser;

  constructor(private router: Router, private auth: AuthService, private firestore: FirestoreService) {
  }


  ngOnInit(): void {
    this.firestore.currentUserStatus.subscribe((data) => {
      this.currentUser = data;
    })
  }

  isLandingPage() {
    return this.router.url == '/landing';
  }

  logout(){
    this.auth.logout();
  }
}
