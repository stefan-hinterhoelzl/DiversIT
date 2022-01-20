import { Component, OnInit } from '@angular/core';
import { serverTimestamp, Timestamp } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { Notification } from '../models/notification.model';
import { DiversITUser } from '../models/users.model';
import { ChatService } from '../services/chat.service';
import { NotificationService } from '../services/notification.service';
import { ObserversService } from '../services/observers.service';
import { UserService } from '../services/user.service';


/**
 * Notifications class.
 *
 * @export
 * @class NotificationsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  /** list of all notifications */
  notifications: Notification[];
  /** subscription to the notifications of the current user */
  notificationSubscription: Subscription;
  /** the current user navigating the application */
  currentUser: DiversITUser;


  /**
   * Creates an instance of NotificationsComponent.
   * @param {UserService} firestore
   * @param {ObserversService} observer
   * @param {ChatService} chatService
   * @param {NotificationService} notificationService
   * @memberof NotificationsComponent
   */
  constructor(private firestore: UserService, private observer: ObserversService, private chatService: ChatService, private notificationService: NotificationService) { }


  /**
   * lifecycle hook - subscribes to the currentuser and the notifications of said user
   *
   * @memberof NotificationsComponent
   */
  ngOnInit(): void {
    this.notificationSubscription = this.observer.notificationsOfUserStatus.subscribe((notifications: any) => {
      if(notifications != null)
      {
        this.notifications = notifications as Notification[]
        this.currentUser = this.observer.getcurrenUserValue
      }
    })
  }


  /**
   * Accepts the mentorship request. The Notification resembels the invitation to form a relationship to a mentor/mentee.
   *
   * @param {Notification} notification
   * @memberof NotificationsComponent
   */
  acceptMentorshipRequest(notification: Notification){
    console.log(this.currentUser)
    if(this.currentUser.role == 2) this.chatService.addRelationship(notification.fromUID, this.currentUser.uid);
    else this.chatService.addRelationship(this.currentUser.uid, notification.fromUID)
    this.notificationService.deleteNotification(notification.uid)
    this.notificationService.addNotification(<Notification>{
      fromName: this.currentUser.firstname + " " + this.currentUser.lastname,
      fromPhotoURL: this.currentUser.photoURL,
      fromUID: notification.toUID,
      toUID: notification.fromUID,
      text: this.currentUser.firstname + " " + this.currentUser.lastname + " hat Ihre Mentorenanfrage angenommen.",
      type: 2,
      when: serverTimestamp(),
      uid: null
    })
  }


  /**
   * declines the mentorship request. The Notification resembels the invitation to form a relationship to a mentor/mentee.
   *
   * @param {Notification} notification
   * @memberof NotificationsComponent
   */
  declineMentorshipRequest(notification: Notification){
    this.notificationService.deleteNotification(notification.uid)
  }



}
