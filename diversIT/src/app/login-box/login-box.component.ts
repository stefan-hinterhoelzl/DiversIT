import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';


/**
 * This component does take care of the authentication process. Here the user will be displayed all possible Login options. 
 *
 * @export
 * @class LoginBoxComponent
 */
@Component({
  selector: 'app-login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.scss']
})
export class LoginBoxComponent {

  /**
   * Creates an instance of LoginBoxComponent.
   * @param {AuthService} auth user authentication service of the webapplication
   * @memberof LoginBoxComponent
   */
  constructor(private auth: AuthService) { }


  /**
   * calls the login method in the authentication service
   *
   * @param {string} provider String representation of provider. e.g. google, github or facebook
   * @memberof LoginBoxComponent
   */
  socialLogin(provider: string) {
    this.auth.socialLogin(provider);
  }
}
