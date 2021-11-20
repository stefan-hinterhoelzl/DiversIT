import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';
import { DiversITUser } from './models/users.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mintistcool';
  currentUser: DiversITUser;

  constructor(private router: Router, private auth: AuthService, private firestore: FirestoreService, private location: Location) {
  }


  ngOnInit(): void {
    this.firestore.currentUserStatus.subscribe((data) => {
      this.currentUser = data;
    })
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
