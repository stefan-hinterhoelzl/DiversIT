import { Injectable, OnDestroy } from '@angular/core';
import { DiversITUser } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, getDoc, setDoc, onSnapshot, updateDoc, serverTimestamp, orderBy, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Post } from '../models/post.model';
import { ChatService } from './chat.service';
import { ObserversService } from './observers.service';
import { NotificationService } from './notification.service';
import { PostsService } from './posts.service';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  constructor(private observer: ObserversService, private chat: ChatService, private notifications: NotificationService, private posts: PostsService) {
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


  authStatusListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.getCurrentUser(user);
      } else {
        this.observer.currentUser.next(null);
        this.observer.currentUserMentors.next(null);
        this.observer.currentUserMentees.next(null);
        if (this.usersub != null) this.usersub();
        if (this.postssub != null) this.postssub();
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
        notifications: [],
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
    this.usersub = onSnapshot(doc(this.db, "users", user.uid), async (doc) => {
      if (doc.exists()) {
        this.observer.currentUser.next(doc.data() as DiversITUser)
        console.log("updating")
        if ((doc.data() as DiversITUser).role == 3) {
          let mentors = await this.getCurrentUserMentors(doc.data() as DiversITUser);
          this.observer.currentUserMentors.next(mentors);
        }
        else {
          let mentees = await this.getCurrentUserMentees(doc.data() as DiversITUser);
          this.observer.currentUserMentees.next(mentees);
        }
        this.chat.initializeChat(doc.data() as DiversITUser)
      }
    });
    this.posts.getPostOfUserObservable(user.uid)
    this.notifications.getNotificationsListener(user.uid)
  }

  async getCurrentUserMentors(user: DiversITUser): Promise<DiversITUser[]> {
    let listOfMentors: DiversITUser[] = [];

    for (let i = 0; i < user.mentors.length; i++) {
      var data = await this.getUserPerIDPromise(user.mentors[i])
      listOfMentors.push(data)
    }
    return listOfMentors;
  }

  async getCurrentUserMentees(user: DiversITUser): Promise<DiversITUser[]> {
    let listOfMentees: DiversITUser[] = [];

    for (let i = 0; i < user.mentees.length; i++) {
      var data = await this.getUserPerIDPromise(user.mentees[i])
      listOfMentees.push(data)
    }
    return listOfMentees
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
      this.observer.currentUserStatus.subscribe((user) => {
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



