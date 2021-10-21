import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.scss']
})
export class LoginBoxComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  loginWithGitHub() {
    this.auth.loginWithGitHub();
  }

  loginWithFacebook() {
    this.auth.loginWithFacebook();
  }

  


}
