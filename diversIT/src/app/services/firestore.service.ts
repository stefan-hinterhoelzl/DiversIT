import { Injectable } from '@angular/core';
import { Mentee, DiversITUser, Mentor, Admin } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, getDoc, setDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import { BehaviorSubject } from 'rxjs';
import { Post } from '../models/post.model';


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

  private currentUser: BehaviorSubject<Admin | Mentor | Mentee> = new BehaviorSubject<Admin | Mentor | Mentee>(null);
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
        if (currentUser.role == 2) this.currentUser.next(currentUser as Mentor);
        else if (currentUser.role == 3) this.currentUser.next(currentUser as Mentee);
        else if (currentUser.role == 1) this.currentUser.next(currentUser as Admin)
      }
    });
  }

  async getUserPerIDPromise(uid: string): Promise<Admin | Mentor | Mentee> {
    return new Promise<Admin | Mentor | Mentee>(async (resolve, reject) => {
      const docRef = doc(this.db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentUser = docSnap.data() as DiversITUser
        if (currentUser.role == 2) this.currentUser.next(currentUser as Mentor);
        else if (currentUser.role == 3) this.currentUser.next(currentUser as Mentee);
        else if (currentUser.role == 1) this.currentUser.next(currentUser as Admin)
      } else {
        reject("User existiert nicht")
      }
    });
  }


  getPostUser(userID: string) {
    return new Promise<Post[]>(async (resolve, reject) => {
      const q = query(collection(this.db, "posts"), where("userID", "==", userID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        reject("Keine Posts gefunden");
      }

      let array: Post[] = [];

      querySnapshot.forEach((doc) => {
        array.push(doc.data() as Post)
      });
      resolve(array);


      
    });
  }


}
