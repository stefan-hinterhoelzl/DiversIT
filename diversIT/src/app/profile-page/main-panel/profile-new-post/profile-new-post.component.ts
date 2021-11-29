import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Firestore, serverTimestamp } from '@firebase/firestore';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-new-post',
  templateUrl: './profile-new-post.component.html',
  styleUrls: ['./profile-new-post.component.scss']
})
export class ProfileNewPostComponent implements OnInit {
  @Input() currentUser: DiversITUser;
  postForm: FormGroup;
  @ViewChild('formDirective') private formDirective: NgForm;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      text: new FormControl('', Validators.required),
      photoURL: new FormControl('')
    })
  }


  addPost(){
    if(this.postForm.valid){
      let postPayload = <Post>{
        text: this.postForm.get('text').value,
        timestamp: serverTimestamp(),
        userID: this.currentUser.uid,
        photoURL: this.postForm.get('photoURL').value
      }


      this.userService.addPost(postPayload)

      // this.postForm.updateValueAndValidity()
      this.formDirective.resetForm()
      this.postForm.reset()
      // this.postForm.markAsUntouched()
      this.userService.UpdateUserAccount(this.currentUser.uid, this.currentUser.email, this.currentUser.photoURL)
    }
    else{

    }

  }
}
