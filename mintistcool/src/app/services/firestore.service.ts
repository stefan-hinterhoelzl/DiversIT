import { Injectable } from '@angular/core';
import { User } from '../models/users.model'
import { getFirestore, collection, doc, where, query, getDocs, setDoc } from "firebase/firestore";


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }

  db = getFirestore();

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



}
