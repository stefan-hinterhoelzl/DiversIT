import { Component, OnInit } from '@angular/core';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { Post, PostDisplay } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-center-panel',
  templateUrl: './center-panel.component.html',
  styleUrls: ['./center-panel.component.scss']
})
export class CenterPanelComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  currentUser: DiversITUser;
  mentors: DiversITUser[];
  posts: PostDisplay[] = [];

  ngOnInit(): void {    
    this.firestore.currentUserStatus.subscribe((data) => {
      if (data != null) {
        this.currentUser = data
        if(this.currentUser.role == 3)this.initializeMentee()
        else if(this.currentUser.role == 2)this.initializeMentor()
      }
    });
  }

  initializeMentee(){
    this.firestore.currentUserMentorsStatus.subscribe(async (data) => {
      if(data == null) return;
      this.mentors = data;

      // loop through all mentors and get all posts of each mentor
      for( let i = 0; i< this.mentors.length; i++){
        let postsOfMentor: Post[] = await this.firestore.getPostUser(this.mentors[i].uid)
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
