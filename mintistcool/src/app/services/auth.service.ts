import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from "firebase/auth";
import { FirestoreService } from './firestore.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private firestore: FirestoreService) { }


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
      this.firestore.CreateUserDataForNewAccount(user.uid, user.email);
      this.router.navigate(['/app']);
    }).catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/account-exists-with-different-credential") {
        console.error("Email exisitiert schon mit anderer Sign-In Methode!")
      }
    });
  }

  logout() {
    const auth = getAuth();
    auth.signOut().then(()=> {
      this.router.navigate(["/landing"])
    });
  }

  getAuthUserObject() {
    const auth = getAuth();
    return auth.currentUser;
  }

}