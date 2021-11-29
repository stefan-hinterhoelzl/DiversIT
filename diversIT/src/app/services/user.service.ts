import { Injectable, OnDestroy } from '@angular/core';
import { DiversITUser } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, getDoc, setDoc, onSnapshot, updateDoc, serverTimestamp, arrayUnion, addDoc, SnapshotOptions, orderBy, increment, Timestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { BehaviorSubject, Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { Chat, Message } from '../models/chat.model';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  constructor() {
    this.authStatusListener();
  }


  ngOnDestroy(): void {
   if (this.usersub != null) this.usersub();
  }

  db = getFirestore();
  auth = getAuth();
  usersub;
  // chatsub;
  postssub;

  private currentUser: BehaviorSubject<DiversITUser> = new BehaviorSubject<DiversITUser>(null);
  currentUserStatus = this.currentUser.asObservable();

  private currentUserMentors: BehaviorSubject<DiversITUser[]> = new BehaviorSubject<DiversITUser[]>(null);
  currentUserMentorsStatus = this.currentUserMentors.asObservable()

  private currentUserMentees: BehaviorSubject<DiversITUser[]> = new BehaviorSubject<DiversITUser[]>(null);
  currentUserMenteesStatus = this.currentUserMentors.asObservable()

  private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(null);
  messagesStatus = this.messages.asObservable();

  private chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>(null);
  chatStatus = this.chats.asObservable();

  private posts: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>(null);
  postStatus = this.posts.asObservable();

  authStatusListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.getCurrentUser(user);
      } else {
        this.currentUser.next(null);
        this.currentUserMentors.next(null);
        this.currentUserMentees.next(null);
        if (this.usersub != null) this.usersub();
      }
    });
  }


  async UpdateUserAccount(uid: string, email: string, photoURL: string) {
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
        photoURL: photoURL,
        backgroundInfos: [],
      });
    } else {
      updateDoc(docRef, {
        lastLoggedIn: serverTimestamp()
      });
    }
  }

  UpdateCurrentUserAccount(user: DiversITUser) {
    updateDoc(doc(this.db, "users", user.uid), {
      role: user.role,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender,
      primaryEducation: user.primaryEducation,
      secondaryEducation: user.secondaryEducation,
      universityEducation: user.universityEducation,
      job: user.job,
      uid: user.uid,
      lastLoggedIn: user.lastLoggedIn,
      creationTime: user.creationTime,
      mentors: user.mentors,
      mentees: user.mentees,
      company: user.company,
      maxMentees: user.maxMentees,
      girlsOnlyMentor: user.girlsOnlyMentor,
      photoURL: user.photoURL
    });
  }

  getCurrentUser(user: User) {
    this.usersub = onSnapshot(doc(this.db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        this.currentUser.next(doc.data() as DiversITUser)
        if ((doc.data() as DiversITUser).role == 3) {
          this.getCurrentUserMentors(doc.data() as DiversITUser);
        }
        else {
          this.getCurrentUserMentees(doc.data() as DiversITUser)
          this.getPostOfUserObservable(user.uid)
        }
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

  async getCurrentUserMentees(user: DiversITUser) {
    let listOfMentees: DiversITUser[] = [];

    for (let i = 0; i < user.mentees.length; i++) {
      var data = await this.getUserPerIDPromise(user.mentees[i])
      listOfMentees.push(data)
    }
    this.currentUserMentors.next(listOfMentees)
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

      let currentUser: DiversITUser = null;
      this.currentUserStatus.subscribe((user) => {
        if (user != null) currentUser = user;
      });
      // Check if user is the same as the mentor
      if (mentor.uid == currentUser.uid) return;
      // Check if user/mentee is already in contact with mentor
      if (mentor.mentees.includes(currentUser.uid)) return;
      // Check if mentor has already reached max mentee number
      if (mentor.mentees.length == mentor.maxMentees) return;
      array.push(mentor);
    });
    return array;
  }

  async getAllMentorsPromise(): Promise<DiversITUser[]> {
    const q = query(collection(this.db, "users"), where("role", "==", 2));
    const querySnapshot = await getDocs(q);
    let array: DiversITUser[] = []
    querySnapshot.forEach((doc) => {
      let mentor = doc.data() as DiversITUser;
      array.push(mentor);
    });
    return array;
  }

  async getPostUser(userID: string): Promise<Post[]> {
    const q = query(collection(this.db, "posts"), where("userID", "==", userID), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    let array: Post[] = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data() as Post)
    });
    return array;
  }

  async getPostOfUserObservable(userID: string) {
    this.postssub = onSnapshot(query(collection(this.db, "posts"), where("userID", "==", userID), orderBy("timestamp", "desc")), (q) => {
      let arr: Post[] = []
      q.forEach((doc) => {
        arr.push(doc.data() as Post)
        }
      )
      this.posts.next(arr)
    })
  }


  async addPost(post: Post) {
    const docRef = doc(collection(this.db, 'posts'))
    await setDoc(docRef, post)
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



