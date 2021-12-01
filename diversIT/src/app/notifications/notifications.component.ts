import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { Notification } from '../models/notification.model';
import { DiversITUser } from '../models/users.model';
import { ChatService } from '../services/chat.service';
import { NotificationService } from '../services/notification.service';
import { ObserversService } from '../services/observers.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[];
  notificationSubscription: Subscription;
  currentUser: DiversITUser;

  constructor(private firestore: UserService, private observer: ObserversService, private chatService: ChatService, private notificationService: NotificationService) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.notificationSubscription = this.observer.notificationsOfUserStatus.subscribe((notifications: any) => {
      if(notifications != null)
      {
        this.notifications = notifications as Notification[]
        this.currentUser = this.observer.getcurrenUserValue
      }
    })
  }

  acceptMentorshipRequest(notification: Notification){
    console.log(this.currentUser)
    if(this.currentUser.role == 2) this.chatService.addRelationship(notification.fromUID, this.currentUser.uid);
    else this.chatService.addRelationship(this.currentUser.uid, notification.fromUID)
    this.notificationService.deleteNotification(notification.uid)
  }

  declineMentorshipRequest(notification: Notification){
    this.notificationService.deleteNotification(notification.uid)
  }



}
