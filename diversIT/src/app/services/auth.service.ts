import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from "firebase/auth";
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { UserService } from './user.service';



/**
 * Service to take care of authentication
 *
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Creates an instance of AuthService.
   * @param {Router} router
   * @param {UserService} firestore
   * @param {SnackbarComponent} snackbar
   * @memberof AuthService
   */
  constructor(private router: Router, 
    private firestore: UserService, 
    private snackbar: SnackbarComponent) {}



  /**
   * Authenticates a Firebase client using a popup-based OAuth authentication flow.
   *
   * @param {string} socialProvider string of provider. either facebook, google or github
   * @memberof AuthService
   */
  socialLogin(socialProvider: string) {

    const auth = getAuth();

    let provider: any;
    if (socialProvider == "facebook") {
      provider = new FacebookAuthProvider();
    } 
    else if (socialProvider == "google") {
      provider = new GoogleAuthProvider();
    } 
    else if (socialProvider == "github") {
      provider = new GithubAuthProvider();
    } 

    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      this.firestore.UpdateUserAccount(user.uid, user.email, user.photoURL);
      let snackbarRef = this.snackbar.openSnackBar("Eingeloggt!", "green-snackbar");
    }).catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/account-exists-with-different-credential") {
        this.snackbar.openSnackBar("Email existiert bereits.", "red-snackbar");
      }
    });
  }



  /**
   * Signs the user out and navigates the user to the landingpage.
   *
   * @memberof AuthService
   */
  logout() {
    const auth = getAuth();
    auth.signOut().then(()=> {
      this.router.navigate(["/landing"])
      this.snackbar.openSnackBar("Abgemeldet!", "green-snackbar");
    });
  }


  /**
   * used to get the current signed in user
   * 
   * @return {*} the current signed in user 
   * @memberof AuthService
   */
  getAuthUserObject() {
    const auth = getAuth();
    return auth.currentUser;
  }

}