import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  loginWithGoogle() {

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("LoggedIn");
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(credential,token,user)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
}
