import { Component, OnInit } from '@angular/core';
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
  posts: PostDisplay[];

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
      console.log(data)
      if(data == null) return;
      this.mentors = data;
      console.log(this.mentors)
      this.mentors.forEach((mentor: DiversITUser)=>{
        console.log(mentor)
      })


      for( let i = 0; i< this.mentors.length; i++){
        console.log(this.mentors[i])
        let postsOfMentor: Post[] = await this.firestore.getPostUser(this.mentors[i].uid)
        let postForDisplay: PostDisplay[];
        console.log(postsOfMentor)
        for( let j = 0; j < postsOfMentor.length; j++){
          const newDisplayPost = <PostDisplay>{
            userName: this.mentors[i].firstname + " " + this.mentors[i].lastname,
            userImgURL: this.mentors[i].photoURL,
            text: postsOfMentor[j].text,
            timestamp: postsOfMentor[j].timestamp,
            photoURL: postsOfMentor[j].photoURL
          }
          console.log(newDisplayPost)
          postForDisplay.push(newDisplayPost)
        }

        this.posts.concat(postForDisplay)
      }
      console.log(this.posts)
    })
  }

  initializeMentor(){

  }

}
