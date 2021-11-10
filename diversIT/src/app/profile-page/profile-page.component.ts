import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  constructor(private firestore: FirestoreService, private route: ActivatedRoute) { }

  currentUserSubscription: Subscription;
  currentRouteSubscription: Subscription;
  currentUser: DiversITUser;
  alternateUser: DiversITUser;
  ownProfile: boolean;

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.firestore.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;

        this.currentRouteSubscription = this.route.params.subscribe(params => {
          let id: string = params['id'];
          this.initialize(id);
        });
      }
    });    
  }

  async initialize(id) {
    if (this.currentUser.uid == id) {
      this.ownProfile = true;
    }
    else {
      this.alternateUser = await this.firestore.getUserPerIDPromise(id).catch(error => console.log(error));
      this.ownProfile = false;
    }

  }

}
