import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiversITUser } from 'src/app/models/users.model';
import { ObserversService } from 'src/app/services/observers.service';
import { UserService } from 'src/app/services/user.service';
import { InterestingMentorsComponent } from '../right-panel/interesting-mentors/interesting-mentors.component';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit, OnDestroy {

  constructor(private firestore: UserService, private observer: ObserversService)  { }

  userSubscription: Subscription;

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  currentUser: DiversITUser = <DiversITUser>{
    firstname: "",
    lastname: "",
    photoURL: "",
    job: "",
    uid: ""
  };

  ngOnInit(): void {
    this.userSubscription = this.observer.currentUserStatus.subscribe(data => {
      if (data === null) return;
      this.currentUser = data;
    })

  }

}
