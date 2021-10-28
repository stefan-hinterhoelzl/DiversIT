import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from "firebase/auth";
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { FirestoreService } from './firestore.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private firestore: FirestoreService, private snackbar: SnackbarComponent) { }


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
      //Only on first Login
      this.firestore.CreateUserDataForNewAccount(user.uid, user.email);
      this.router.navigate(['/app']);
      let snackbarRef = this.snackbar.openSnackBar("Eingeloggt!", "green-snackbar");
    }).catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/account-exists-with-different-credential") {
        this.snackbar.openSnackBar("Email existiert bereits.", "red-snackbar");
      }
    });
  }

  logout() {
    const auth = getAuth();
    auth.signOut().then(()=> {
      this.router.navigate(["/landing"])
      this.snackbar.openSnackBar("Abgemeldet!", "green-snackbar");
    });
  }

  getAuthUserObject() {
    const auth = getAuth();
    return auth.currentUser;
  }

}