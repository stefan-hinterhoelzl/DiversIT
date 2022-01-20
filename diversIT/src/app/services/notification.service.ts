import { Injectable, OnDestroy } from "@angular/core";
import { update } from "@firebase/database";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { Subscriber, Subscription } from "rxjs";
import { Notification } from "../models/notification.model";
import { ObserversService } from "./observers.service";


/**
 * service class for all notification related firebase stuff.
 *
 * @export
 * @class NotificationService
 * @implements {OnDestroy}
 */
@Injectable({
    providedIn: 'root'
  })
  export class NotificationService implements OnDestroy {

    /** connection to firestore */
    db = getFirestore();
    /** subscription object used to unsubscribe when service is destroyed */
    unsubscribeFromNotifications;

    /**
     * Creates an instance of NotificationService.
     * @param {ObserversService} observer object of the observerService
     * @memberof NotificationService
     */
    constructor(private observer: ObserversService) {}


    /**
     * unsubscribes from Notifications when service is destroyed
     *
     * @memberof NotificationService
     */
    ngOnDestroy(): void {
      this.unsubscribeFromNotifications()
    }


    /**
     * creates listener for notifications and pushes new messages to the behavior subject.
     *
     * @param {string} userId id of user for which notifications should be aquired and listened to
     * @memberof NotificationService
     */
    async getNotificationsListener(userId: string){
      const q = query(collection(this.db, "notifications"), where("toUID", "==", userId));
      this.unsubscribeFromNotifications = onSnapshot(q, (querySnapshot) => {
        const notifications = [];
        querySnapshot.forEach((doc) => {
          notifications.push(doc.data())
        });
        this.observer.notificationsOfUser.next(notifications)
      })
    }



    /**
     * pushes a new Notification to a user. Called by e.g. requesting mentorship.
     *
     * @param {Notification} notification object of type Notification
     * @memberof NotificationService
     * 
     * @example
     *

        this.notificationService.addNotification(<Notification>{
          fromName: this.currentUser.firstname + " " + this.currentUser.lastname,
          fromPhotoURL: this.currentUser.photoURL,
          fromUID: this.currentUser.uid,
          toUID: this.userOfProfile.uid,
          text: result.inputFieldValue !== undefined ? result.inputFieldValue : "",
          type: 1, // Type: 1 = Anfrage (Buttons: Annehmen, Ablehnen); 2 = Info (Keine Buttons)
          when: null
        }).then((data) =>
          //do stuff
        )
     */
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


    /**
     * deletes a Notification in firestore. Used when the user read the Notification and does not want it to be displayed anymore. 
     *
     * @param {string} notificationId Id of Notification
     * @memberof NotificationService
     */
    async deleteNotification(notificationId: string) {
      await deleteDoc(doc(this.db, "notifications", notificationId))
    }

    
    /**
     * checks if a request for a mentorship already exists. Order of userIds does not matter. 
     *
     * @param {string} uid1 user id of first person. E.g. Mentor
     * @param {string} uid2 user id of second person. E.g. Mentee
     * @return {*} the amount of existing requests. No requests have been sent, when the return value equals 0.
     * @memberof NotificationService
     */
    async checkIfMentorRequestHasAlreadyBeenSent(uid1: string, uid2: string){
      let result: number = 0;
      const q1 = query(collection(this.db, "notifications"), where("fromUID", "==", uid1), where("toUID", "==", uid2), where("type", "==", 1))
      const q2 = query(collection(this.db, "notifications"), where("fromUID", "==", uid2), where("toUID", "==", uid1), where("type", "==", 1))
      const querySnapshot1 = await getDocs(q1)
      const querySnapshot2 = await getDocs(q2)

      return querySnapshot1.size + querySnapshot2.size;
    }

  }
