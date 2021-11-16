import { Injectable } from '@angular/core';
import { DiversITUser } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, getDoc, setDoc, onSnapshot, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
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
  currentUserMentorsStatus = this.currentUserMentors.asObservable()


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
        lastLoggedIn: serverTimestamp(),
        creationTime: serverTimestamp(),
        mentors: [],
        mentees: [],
        company: "",
        maxMentees: -1,
        girlsOnlyMentor: false,

      });
    } else {
      updateDoc(docRef, {
        lastLoggedIn: serverTimestamp()
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


  async getCurrentUserMentors(user: DiversITUser) {
    let listOfMentors: DiversITUser[] = [];

    for (let i = 0; i < user.mentors.length; i++) {
      var data = await this.getUserPerIDPromise(user.mentors[i])
      listOfMentors.push(data)
    }
    this.currentUserMentors.next(listOfMentors)
  }


  async getUserPerIDPromise(uid: string): Promise<DiversITUser> {
    const docRef = doc(this.db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DiversITUser
    } else {
      return null
    }

  }


  async getAllUsersPromise(): Promise<DiversITUser[]> {
    const querySnapshot = await getDocs(collection(this.db, "users"));
    let array: DiversITUser[] = []
    querySnapshot.forEach((doc) => {
      array.push(doc.data() as DiversITUser)
    });
    return array;
  }

  async getAllInterestingMentorsPromise(): Promise<DiversITUser[]> {
    const q = query(collection(this.db, "users"), where("role", "==", 2));
    const querySnapshot = await getDocs(q);
    let array: DiversITUser[] = []
    querySnapshot.forEach((doc) => {
      let mentor = doc.data() as DiversITUser;
      // Check if user/mentee is already in contact with mentor
      let currentUser: DiversITUser = null;
      this.currentUserStatus.subscribe((user) => {
        if (user != null) currentUser = user;
      });
      if (mentor.mentees.includes(currentUser.uid)) return;
      // Check if mentor has already reached max mentee number
      if (mentor.mentees.length == mentor.maxMentees) return;
      array.push(mentor);
    });
    return array;
  }

  async getPostUser(userID: string): Promise<Post[]> {
    const q = query(collection(this.db, "posts"), where("userID", "==", userID));
    const querySnapshot = await getDocs(q);
    let array: Post[] = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data() as Post)
    });
    return array;
  }

  async addRelationship(mentee: string, mentor: string) {
    const docRefMentor = doc(this.db, "users", mentor);
    const docRefMentee = doc(this.db, "users", mentee)

    await updateDoc(docRefMentor, {
      mentees: arrayUnion(mentee)
    });

    await updateDoc(docRefMentee, {
      mentors: arrayUnion(mentor)
    });
  }


  async promoteMenteeToMentor(user: DiversITUser) {
    const docRef = doc(this.db, 'users', user.uid)

    return updateDoc(docRef, {
      role: 2,
      mentors: []
    });
  }

  async demoteMenteeToMentor(user: DiversITUser) {
    const docRef = doc(this.db, 'users', user.uid)

    return updateDoc(docRef, {
      role: 3,
      mentees: []
    });
  }


}
