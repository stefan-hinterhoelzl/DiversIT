import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from "firebase/auth";
import { FirestoreService } from './firestore.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private firestore: FirestoreService) { }


  loginWithGoogle() {

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      this.firestore.CreateUserDataForNewAccount(user.uid, user.email);
      this.router.navigate(['/app']);
    }).catch((error) => {
      console.log("error")
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  loginWithGitHub() {
    const authGithub = getAuth();
    const providerGithub = new GithubAuthProvider();

    signInWithPopup(authGithub, providerGithub)
    .then((result) => {
      console.log("hallo")
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      this.firestore.CreateUserDataForNewAccount(user.uid, user.email);
      this.router.navigate(['/app']);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GithubAuthProvider.credentialFromError(error);
    });
  }


  logout() {
    const auth = getAuth();
    auth.signOut().then(()=> {
      this.router.navigate(["/landing"])
    });
  }
}
