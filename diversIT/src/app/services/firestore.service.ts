import { Injectable } from '@angular/core';
import { Mentee, DiversITUser } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, getDoc, setDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
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

  private currentUser: BehaviorSubject<DiversITUser> = new BehaviorSubject<DiversITUser>(null);
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

  async UpdateUserAccount(uid: string, email: string) {
    const docRef = doc(this.db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(doc(this.db, "users", uid), {
        role: 3,
        email: email,
        firstname: "",
        lastname: "",
        gender: "",
        primaryEducation: "",
        secondaryEducation: "",
        universityEducation: "",
        job: "",
        uid: uid,
        lastloggedIn: Timestamp.now(),
        creationTime: Timestamp.now(),
        mentors: [],
      });
   
    }
  }

  getCurrentUser(user: User) {
    this.usersub = onSnapshot(doc(this.db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const currentUser = doc.data() as DiversITUser
        this.currentUser.next(currentUser);
      }
    });
  }

  async getUserPerIDPromise(uid: string) {
    return new Promise<any>(async (resolve, reject) => {
      const docRef = doc(this.db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        resolve(docSnap.data())
      } else {
        reject("User existiert nicht")
      }
    });
  }


}
