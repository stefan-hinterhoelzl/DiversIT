import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore';
import { take } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DiversITUser } from 'src/app/models/users.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {

  constructor(private router: Router, private dialog: MatDialog, private postService: PostsService) { }

  @Input() userid: string;
  @Input() name: string;
  @Input() time: Timestamp;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() contentImg: string;
  @Input() currentUser: DiversITUser;
  @Input() postuid: string;


  navigateToProfile() {
    this.router.navigate(["profile/" + this.userid])
  }

  editPost(){
    //init dialog with data and styling
    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: "60%",
      data: {
        header: "Bearbeiten",
        text: "Ändern Sie ihre Mitteilung nach belieben.",
        placeholderForInputArea: "Sag etwas:",
        inputAreaValue: this.content,        
        placeholderForInput: "Optional: Bild URL",
        inputValue: this.contentImg,       
        buttonTextConfirm: "Änderungen speichern",
        buttonTextAbort: "Verwerfen",
      },
    });

    //detects when dialog is closed, and checks if the confirm button was clicked or the abort button
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if(result != null){
        // user wants to update posts
        console.log(result)
        if(this.content != result.inputAreaValue || this.contentImg != result.inputValue){
          this.postService.updatePost(this.postuid, result.inputAreaValue, result.inputValue)
        }
      }
    });
  }

  //delete post - open dialog for confirmation
  deletePost(){
    //init dialog with data and styling
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "30%",
      data: {
        header: "Löschen?",
        text: "Sind Sie sich wirklich sicher, dass sie diese Mitteilung löschen möchten?\n Dieser Schritt kann nicht rückgängig gemacht werden.",
        buttonTextConfirm: "Mitteilung löschen",
        buttonTextAbort: "Abbrechen",
      },
    });

    //detects when dialog is closed, and checks if the confirm button was clicked or the abort button
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if(result != null){
        // user wants to delete posts
        this.postService.deletePost(this.postuid)
      }
    });
  }
}
