import { Component, OnDestroy, OnInit } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Subscription } from 'rxjs';
import { Post, PostDisplay } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { ObserversService } from 'src/app/services/observers.service';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-center-panel',
  templateUrl: './center-panel.component.html',
  styleUrls: ['./center-panel.component.scss']
})
export class CenterPanelComponent implements OnInit, OnDestroy {

  constructor(private firestore: UserService, private observer: ObserversService, private postService: PostsService) { }

  ngOnDestroy(): void {
    this.usersub.unsubscribe();
    this.initializeMenteeSub.unsubscribe();
  }

  currentUser: DiversITUser;
  mentors: DiversITUser[];
  posts: PostDisplay[] = [];
  usersub: Subscription;
  initializeMenteeSub: Subscription;

  ngOnInit(): void {
    this.usersub = this.observer.currentUserStatus.subscribe((data) => {
      if (data != null) {
        this.currentUser = data
        if(this.currentUser.role == 3)this.initializeMentee()
        else if(this.currentUser.role == 2)this.initializeMentor()
      }
    });
  }

  initializeMentee(){
    console.log("test" +this.posts)
    this.initializeMenteeSub = this.observer.currentUserMentorsStatus.subscribe(async (data) => {
      if(data == null) return;
      this.mentors = data;
      this.posts = [];

      // loop through all mentors and get all posts of each mentor
      for( let i = 0; i< this.mentors.length; i++){
        let postsOfMentor: Post[] = await this.postService.getPostUser(this.mentors[i].uid)
        // remodel the post to contain all necessary data
        for( let j = 0; j < postsOfMentor.length; j++){
          const newDisplayPost = <PostDisplay>{
            userID: postsOfMentor[j].userID,
            userName: this.mentors[i].firstname + " " + this.mentors[i].lastname,
            userImgURL: this.mentors[i].photoURL,
            text: postsOfMentor[j].text,
            timestamp: postsOfMentor[j].timestamp,
            photoURL: postsOfMentor[j].photoURL
          }
          this.posts.push(newDisplayPost)
        }
      }

      // all posts should be loaded
      this.posts.sort((a,b) => b.timestamp.toMillis() - a.timestamp.toMillis())

    })
  }

  initializeMentor(){

  }

}
