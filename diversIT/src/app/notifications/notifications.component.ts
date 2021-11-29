import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { Subscription } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { ObserversService } from '../services/observers.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  currentUserSubscription: Subscription;
  currentUser: DiversITUser;

  constructor(private firestore: UserService, private observer: ObserversService) { }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
      }
    });
  }

}
