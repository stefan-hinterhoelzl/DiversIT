import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';
import {MatDialog} from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { ChatService } from 'src/app/services/chat.service';
import { take } from 'rxjs/operators';
import { Notification } from 'src/app/models/notification.model';
import { serverTimestamp, Timestamp } from '@firebase/firestore';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-profile-head',
  templateUrl: './profile-head.component.html',
  styleUrls: ['./profile-head.component.scss']
})
export class ProfileHeadComponent implements OnInit, OnChanges {

  constructor(private userService: UserService, private route: ActivatedRoute,private router: Router, private dialog: MatDialog, private chatService: ChatService, private notificationService: NotificationService) { }

  @Input() userOfProfile: DiversITUser;
  @Input() currentUser: DiversITUser;
  @Input() posts: Post[];
  @Output() changeDetailsBoolean = new EventEmitter<boolean>();
  showUserDetails = false
  profileIdSubscription;
  visible = true;
  openRequest;

  ngOnInit(): void {
    this.profileIdSubscription = this.route.snapshot.paramMap.get('id')
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.currentUser && changes.currentUser.currentValue){
      this.checkButton()
    }
    if(changes.userOfProfile != null){
      this.checkButton()
    }
  }

  checkButton(){
    if(this.userOfProfile && this.currentUser){
      this.notificationService.checkIfMentorRequestHasAlreadyBeenSent(this.userOfProfile.uid, this.currentUser.uid).then((data) => {
        if(data != 0) this.openRequest = true;
        else this.openRequest = false;
      })
      console.log(this.openRequest)
    }
    else console.log("nullvalue beim check")
  }


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
        let notification = <Notification>{
          fromName: this.currentUser.firstname + " " + this.currentUser.lastname,
          fromPhotoURL: this.currentUser.photoURL,
          fromUID: this.currentUser.uid,
          toUID: this.userOfProfile.uid,
          text: result.inputFieldValue !== undefined ? result.inputFieldValue : "",
          type: 1, // Type: 1 = Anfrage (Buttons: Annehmen, Ablehnen); 2 = Info (Keine Buttons)
          when: null
        }

        this.notificationService.addNotification(notification).then((data) =>
          this.checkButton()
        )
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
        if(this.currentUser.role == 2) this.chatService.revokeRelationship(this.userOfProfile.uid, this.currentUser.uid)
        else this.chatService.revokeRelationship(this.currentUser.uid, this.userOfProfile.uid)

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
