import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { DiversITUser } from '../models/users.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  constructor(private firestore: UserService, private route: ActivatedRoute) { }

  currentUserSubscription: Subscription;
  currentRouteSubscription: Subscription;
  currentUser: DiversITUser;
  alternateUser: DiversITUser;
  ownProfile: boolean;
  posts: Post[];

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
      this.alternateUser = this.currentUser

      // meine posts
      this.firestore.postStatus.subscribe((data) => {
        this.posts = data;
        console.log(data)
      })
    }
    else {
      this.firestore.getUserPerIDPromise(id).then((data) => {
        this.alternateUser = data;
      }).catch(error => console.log(error));
      this.ownProfile = false;
      // fremde posts
      this.firestore.getPostUser(id).then(async (data: Post[]) => {
        this.posts = data;
      }).catch((error) => console.error(error))
    }






    // this.firestore.getPostOfUserObservable(this.alternateUser.uid)

  }
}
