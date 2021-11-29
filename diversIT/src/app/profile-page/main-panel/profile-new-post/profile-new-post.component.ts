import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Firestore, serverTimestamp } from '@firebase/firestore';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

@Component({
  selector: 'app-profile-new-post',
  templateUrl: './profile-new-post.component.html',
  styleUrls: ['./profile-new-post.component.scss']
})
export class ProfileNewPostComponent implements OnInit {
  @Input() currentUser: DiversITUser;
  postForm: FormGroup;

  constructor(private userService: UserService, private snackbar: SnackbarComponent) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      text: new FormControl(''),
      photoURL: new FormControl('')
    })
  }


  addPost(){
    if((this.postForm.get('text').value !== null && this.postForm.get('text').value.trim() !== '') || (this.postForm.get('photoURL').value !== null && this.postForm.get('photoURL').value.trim() !== '')){
      let postPayload = <Post>{
        text: this.postForm.get('text').value,
        timestamp: serverTimestamp(),
        userID: this.currentUser.uid,
        photoURL: this.postForm.get('photoURL').value
      }


      this.userService.addPost(postPayload)
      this.postForm.reset()
    }
    else{
      this.snackbar.openSnackBar("Eingaben dürfen nicht leer sein!", "snackbar-red")
      this.postForm.reset()
    }

  }
}
