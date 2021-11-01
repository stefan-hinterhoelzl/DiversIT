import { Injectable } from '@angular/core';
import { CUser, OUser } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, setDoc, onSnapshot } from "firebase/firestore";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() {
    this.authStatusListener();
   }

  db = getFirestore();
  auth = getAuth();
  usersub;

  private currentUser: BehaviorSubject<CUser> = new BehaviorSubject<CUser>(null);
  currentUserStatus = this.currentUser.asObservable();


  authStatusListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.getCurrentUser(user);
      } else {
        this.currentUser.next(null);
        if (this.usersub != null) this.usersub();
      }
    });
  }

  async CreateUserDataForNewAccount(uid: string, email: string) {
    const q = query(collection(this.db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await setDoc(doc(this.db, "users", uid), {
        uid: uid,
        email: email,
        //fields to add here
      });
    }
  }

  getCurrentUser(user: User) {
    this.usersub = onSnapshot(doc(this.db, "users", user.uid), (doc) => {
      if (doc.exists) {
        const combinedUser = <CUser> {
          firebaseUser: user,
          customUser: doc.data() as OUser
        };
        this.currentUser.next(combinedUser);
      }
    });
  }



}
