import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';
import {MatDialog} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { ChatService } from 'src/app/services/chat.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile-head',
  templateUrl: './profile-head.component.html',
  styleUrls: ['./profile-head.component.scss']
})
export class ProfileHeadComponent implements OnInit {

  constructor(private userService: UserService, private route: ActivatedRoute,private router: Router, private dialog: MatDialog, private chatService: ChatService) { }

  @Input() userOfProfile: DiversITUser;
  @Input() currentUser: DiversITUser;
  @Input() posts: Post[];
  @Output() changeDetailsBoolean = new EventEmitter<boolean>();
  showUserDetails = false
  profileIdSubscription;
  visible = true;
  ngOnInit(): void {
    this.profileIdSubscription = this.route.snapshot.paramMap.get('id')

  }

  // ngOnChanges(changes: SimpleChanges) {
  //   const currentItem: SimpleChange = changes.currentUser;
  //   if(changes.currentUser && changes.currentUser.currentValue){
  //     let testuser = changes.currentUser.currentValue as DiversITUser
  //     console.log(testuser.firstname)
  //   }
  //   if(changes.userOfProfile != null){
  //     let testuser = changes.userOfProfile.currentValue as DiversITUser
  //     console.log(testuser.firstname)
  //   }
  //   if(changes.postsOfUser != null){
  //     let posts = changes.postsOfUser.currentValue
  //     console.log(posts[1])
  //   }
  // }


  // open Dialoge for adding mentor
  addMentor(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "30%",
      data: {
        header: "Mentorenschaft beantragen",
        text: "Schreibe ein paar Worte über dich, damit dein Mentor dich direkt kennenlernt.",
        placeholderForInput: "Ich möchte Mentee von Ihnen werden weil...",
        buttonTextConfirm: "Anfrage senden",
        buttonTextAbort: "Abbrechen",
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if(result != null){
        // user wants to connect

        // TODO: connect to Mentor and add message (can be retrieved from result.inputFieldValue)
          this.chatService.addRelationship(this.currentUser.uid, this.userOfProfile.uid);
      }
    });
  }

  loadUserInformation(userId) {
    console.log(userId)
  }


  // open dialog to affirm mentorship cancle
  cancleMentorship(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "30%",
      data: {
        header: "Mentorenschaft wirklich beenden?",
        text: "Sind Sie sich wirklich sicher, dass sie diese Mentorenschaft beenden möchten?\n Dieser Schritt kann nicht rückgängig gemacht werden.",
        buttonTextConfirm: "Mentorenschaft beenden",
        buttonTextAbort: "Abbrechen",
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if(result != null){
        // user wants to disconnect
        this.chatService.revokeRelationship(this.currentUser.uid, this.userOfProfile.uid)


      }
    });
  }

  navigateToChatWithMentor(){
    this.router.navigate(['/chat', { k: this.userOfProfile.uid }]);
  }

  navigateToProfileSetting(){
    this.router.navigate(['/profilesettings'])
  }

  showDetails(){
    this.showUserDetails = !this.showUserDetails
    this.changeDetailsBoolean.emit()
  }
    
}
