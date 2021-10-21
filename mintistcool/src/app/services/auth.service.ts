import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";
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
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }


  logout() {
    const auth = getAuth();
    auth.signOut().then(()=> {
      this.router.navigate(["/landing"])
    });
  }
}
