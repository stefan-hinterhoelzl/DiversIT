import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {User} from 'firebase/auth';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  currentUserFirebase: User;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.currentUserFirebase = this.auth.getAuthUserObject();
  }

  logout() {
    this.auth.logout();
  }

}