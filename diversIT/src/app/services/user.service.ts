import { Injectable, OnDestroy } from '@angular/core';
import { DiversITUser } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, getDoc, setDoc, onSnapshot, updateDoc, serverTimestamp, orderBy, addDoc, DocumentReference } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Post } from '../models/post.model';
import { ChatService } from './chat.service';
import { ObserversService } from './observers.service';
import { NotificationService } from './notification.service';
import { PostsService } from './posts.service';


/**
 *  This file contains all firebase methods regarding the user object.
 * @export
 * @class UserService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {



  /**
   * Creates an instance of UserService.
   * @param {ObserversService} observer
   * @param {ChatService} chat
   * @param {NotificationService} notifications
   * @param {PostsService} posts
   * @memberof UserService
   */
  constructor(private observer: ObserversService, private chat: ChatService, private notifications: NotificationService, private posts: PostsService) {
    this.authStatusListener();
  }



  /**
   *  cancles subscription on destroy
   * @memberof UserService
   */
  ngOnDestroy(): void {
    if (this.usersub != null) this.usersub();
  }

  db = getFirestore();
  auth = getAuth();
  usersub;
  // chatsub;
  postssub;


  /**
   *  Listens for changes of the auth status of the user
   * on change, e.g. logout - all oberservs for connected mentors and mentees are set to null
   * @memberof UserService
   */
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


  /**
   *  updates the userobject in firestore
   * @param {string} uid id of user to update
   * @param {string} email new email of user - is allowed to be the same the user already has
   * @param {string} photoURL url to the profileimage of the user
   * @memberof UserService
   */
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


  /**
   *  updates the user object in Firestore
   * @param {DiversITUser} user takes a user object and overwrites the object in the database - based on the given user object id
   * @memberof UserService
   */
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


  
  /**
   *  returns the current user and subscribes to some observables
   * @param {User} user Object of Type {User}
   * @memberof UserService
   */
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


  /**
   *  does provide a Promise which resolves the mentors of the provided user
   * @param {DiversITUser} user Object of user for which mentors should be provided
   * @return {Promise<DiversITUser[]>} returns a Promise you can resolve
   * @memberof UserService
   */
  async getCurrentUserMentors(user: DiversITUser): Promise<DiversITUser[]> {
    let listOfMentors: DiversITUser[] = [];

    for (let i = 0; i < user.mentors.length; i++) {
      var data = await this.getUserPerIDPromise(user.mentors[i])
      listOfMentors.push(data)
    }
    return listOfMentors;
  }


  /**
   *  does provide a Promise which resolves the mentees of the provided user
   * @param {DiversITUser} user Object of user for which mentees should be provided
   * @return {Promise<DiversITUser[]>} returns a Promise you can resolve
   * @memberof UserService
   */
  async getCurrentUserMentees(user: DiversITUser): Promise<DiversITUser[]> {
    let listOfMentees: DiversITUser[] = [];

    for (let i = 0; i < user.mentees.length; i++) {
      var data = await this.getUserPerIDPromise(user.mentees[i])
      listOfMentees.push(data)
    }
    return listOfMentees
  }


  /**
   *  gets the User as a Promise of type {DiversITUser} based on the provided userID
   * @param {string} uid id of user to get
   * @return {Promise<DiversITUser>} which you can resolve to get the userobject
   * @memberof UserService
   */
  async getUserPerIDPromise(uid: string): Promise<DiversITUser> {
    const docRef = doc(this.db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DiversITUser
    } else {
      return null
    }

  }


  /**
   *  get the whole collection of users as a Promis
   * @return  {Promise<DiversITUser[]>} which you can resolve to get an array of all users
   * @memberof UserService
   */
  async getAllUsersPromise(): Promise<DiversITUser[]> {
    const querySnapshot = await getDocs(collection(this.db, "users"));
    let array: DiversITUser[] = []
    querySnapshot.forEach((doc) => {
      array.push(doc.data() as DiversITUser)
    });
    return array;
  }



  /**
   *  used primarily on the Landingpage for highlighting interesing mentors
   * @return {Promise<DiversITUser[]>} Promise containing an Array of interesing Mentors as Type DiverITUser
   * @memberof UserService
   */
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


  /**
   *  get all Mentors
   * @returns {Promise<DiversITUser[]>} Promise of an DiverITUser array containing all Mentors
   * @memberof UserService
   */
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


  /**
   *  function which is only used for testing - should not be implemented for production builds and will be deleted
   * @param {DiversITUser} user object to promote to Mentor based on object's id
   * @returns {*}  
   * @memberof UserService
   */
  async promoteMenteeToMentor(user: DiversITUser) {
    const docRef = doc(this.db, 'users', user.uid)

    return updateDoc(docRef, {
      role: 2,
      mentors: []
    });
  }


  /**
   *  demote a Mentor to a Mentee
   * @param {DiversITUser} user object to demote to Mentee based on object's id
   * @returns {*}
   * @memberof UserService
   */
  async demoteMenteeToMentor(user: DiversITUser) {
    const docRef = doc(this.db, 'users', user.uid)

    return updateDoc(docRef, {
      role: 3,
      mentees: []
    });
  }

}



