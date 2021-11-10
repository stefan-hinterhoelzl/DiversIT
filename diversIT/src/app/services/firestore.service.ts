import { Injectable } from '@angular/core';
import {DiversITUser} from '../models/users.model'
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

  private currentUser: BehaviorSubject<DiversITUser> = new BehaviorSubject<DiversITUser>(null);
  currentUserStatus = this.currentUser.asObservable();

  private currentUserMentors: BehaviorSubject<DiversITUser[]> = new BehaviorSubject<DiversITUser[]>(null);
  currentUserMentorsStatus = this. currentUserMentors.asObservable()


  authStatusListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.getCurrentUser(user);        
      } else {
        this.currentUser.next(null);
        this.currentUserMentors.next(null);
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
        this.currentUser.next(doc.data() as DiversITUser)
        this.getCurrentUserMentors(doc.data() as DiversITUser);
      }
    });
    
  }


  getCurrentUserMentors(user: DiversITUser) {     
    let listOfMentors: DiversITUser[] = [];
    
    for(let i = 0; i < user.mentors.length; i++){
      this.getUserPerIDPromise(user.mentors[i]).then((data) => {
        listOfMentors.push(data)
      })
    }
    this.currentUserMentors.next(listOfMentors)      
  }



  async getUserPerIDPromise(uid: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const docRef = doc(this.db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        resolve(docSnap.data() as DiversITUser)
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
