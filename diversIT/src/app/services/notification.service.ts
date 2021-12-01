import { Injectable, OnDestroy } from "@angular/core";
import { update } from "@firebase/database";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { Subscriber, Subscription } from "rxjs";
import { Notification } from "../models/notification.model";
import { ObserversService } from "./observers.service";


@Injectable({
    providedIn: 'root'
  })
  export class NotificationService implements OnDestroy {
  
    db = getFirestore();
    unsubscribeFromNotifications; 
    constructor(private observer: ObserversService) {}

    ngOnDestroy(): void {
      this.unsubscribeFromNotifications()
    }
    
      async getNotificationsListener(userId: string){
        const q = query(collection(this.db, "notifications"), where("toUID", "==", userId));
        this.unsubscribeFromNotifications = onSnapshot(q, (querySnapshot) => {
          const notifications = [];
          querySnapshot.forEach((doc) => {
            notifications.push(doc.data())
          });
          console.log(notifications)
          this.observer.notificationsOfUser.next(notifications)
        })
      }

      async addNotification(notification: Notification){
        const userReference = collection(this.db, 'notifications')

        const ref = await addDoc(userReference, {
          fromName: notification.fromName,
          fromPhotoURL: notification.fromPhotoURL,
          fromUID: notification.fromUID,
          toUID: notification.toUID,
          text: notification.text,
          type: notification.type,
          when: serverTimestamp(),
          uid: null
        }) 

        await updateDoc(ref, {
          uid: ref.id
        })
      }

      async deleteNotification(notificationId: string) {
        await deleteDoc(doc(this.db, "notifications", notificationId))
      }

      async checkIfMentorRequestHasAlreadyBeenSent(uid1: string, uid2: string){
        let result: number = 0;
        const q1 = query(collection(this.db, "notifications"), where("fromUID", "==", uid1), where("toUID", "==", uid2), where("type", "==", 1))
        const q2 = query(collection(this.db, "notifications"), where("fromUID", "==", uid2), where("toUID", "==", uid1), where("type", "==", 1))
        const querySnapshot1 = await getDocs(q1)
        const querySnapshot2 = await getDocs(q2)

        return querySnapshot1.size + querySnapshot2.size;
      }
    
  }