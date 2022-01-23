import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Firestore, serverTimestamp } from '@firebase/firestore';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { PostsService } from 'src/app/services/posts.service';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';


/**
 * componet of profile page which doesn't contain other components
 *
 * @export
 * @class ProfileNewPostComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profile-new-post',
  templateUrl: './profile-new-post.component.html',
  styleUrls: ['./profile-new-post.component.scss']
})
export class ProfileNewPostComponent implements OnInit {
  @Input() currentUser: DiversITUser;
  postForm: FormGroup;

  constructor(private userService: UserService, private snackbar: SnackbarComponent, private postService: PostsService) { }


  /**
   * creates a form on generation
   *
   * @memberof ProfileNewPostComponent
   */
  ngOnInit(): void {
    this.postForm = new FormGroup({
      text: new FormControl(''),
      photoURL: new FormControl('')
    })
  }


  /**takes the data of the form and creates a new post entry in the database. */
  addPost(){
    if((this.postForm.get('text').value !== null && this.postForm.get('text').value.trim() !== '') || (this.postForm.get('photoURL').value !== null && this.postForm.get('photoURL').value.trim() !== '')){
      let postPayload = <Post>{
        text: this.postForm.get('text').value,
        timestamp: serverTimestamp(),
        userID: this.currentUser.uid,
        photoURL: this.postForm.get('photoURL').value
      }


      this.postService.addPost(postPayload)
      this.postForm.reset()
    }
    else{
      this.snackbar.openSnackBar("Eingaben dürfen nicht leer sein!", "snackbar-red")
      this.postForm.reset()
    }

  }
}
