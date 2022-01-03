import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { DiversITUser } from '../models/users.model';
import { ObserversService } from '../services/observers.service';
import { PostsService } from '../services/posts.service';
import { UserService } from '../services/user.service';

/**
 * @description Main Component of the profile page. 
 * @export
 * @class ProfilePageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  /**
   * Creates an instance of ProfilePageComponent.
   * @param {UserService} firestore
   * @param {ActivatedRoute} route
   * @param {ObserversService} observer
   * @param {PostsService} postService
   * @memberof ProfilePageComponent
   */
  constructor(private firestore: UserService, private route: ActivatedRoute, private observer: ObserversService, private postService: PostsService) { }

  /**
   * @ignore
   */
  currentUserSubscription: Subscription;
  currentRouteSubscription: Subscription;
  currentPostSubscription: Subscription;
  currentUser: DiversITUser;
  alternateUser: DiversITUser;
  ownProfile: boolean;
  posts: Post[];


  /**
   * @description closes all subscribtion on destroy of component
   * @memberof ProfilePageComponent
   */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.currentPostSubscription ? this.currentPostSubscription.unsubscribe() : null;
    this.currentRouteSubscription.unsubscribe();
  }


  /**
   * @description subscribes to current user and gets id of userpage to display from route. Loads the necessary data.
   * @memberof ProfilePageComponent
   */
  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
        this.currentRouteSubscription = this.route.params.subscribe(params => {
          let id: string = params['id'];
          this.initialize(id);
        });
      }
    });
  }


  /**
   * @description this method first finds out if the page presentet to the user is the page of the user or another user.
   * following that either the posts of the user himself are loaded or the posts of another user. 
   * If i am the user, a subscription gets created, if not i will just receive an array with all the posts once. 
   * @param {*} id of profile to display
   * @memberof ProfilePageComponent
   */
  async initialize(id) {
    if (this.currentUser.uid == id) {
      this.ownProfile = true;
      this.alternateUser = this.currentUser

      // meine posts
      this.currentPostSubscription = this.observer.currentUserPostsStatus.subscribe((data) => {
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
      this.postService.getPostUser(id).then((data: Post[]) => {
        this.posts = data;
      }).catch((error) => console.error(error))
    }






    // this.firestore.getPostOfUserObservable(this.alternateUser.uid)

  }
}
