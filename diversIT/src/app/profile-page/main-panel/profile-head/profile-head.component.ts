import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { ChatService } from 'src/app/services/chat.service';
import { take } from 'rxjs/operators';
import { Notification } from 'src/app/models/notification.model';
import { serverTimestamp, Timestamp } from '@firebase/firestore';
import { NotificationService } from 'src/app/services/notification.service';


/**
 * head of the main panel in the profilepage component
 *
 * @export
 * @class ProfileHeadComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
  selector: 'app-profile-head',
  templateUrl: './profile-head.component.html',
  styleUrls: ['./profile-head.component.scss']
})
export class ProfileHeadComponent implements OnInit, OnChanges {


  /**
   * Creates an instance of ProfileHeadComponent.
   * @memberof ProfileHeadComponent
   */
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private chatService: ChatService, private notificationService: NotificationService) { }

  /** data which is handed down from the parent component */
  /** userdata of the profile the currentuser is viewing */
  @Input() userOfProfile: DiversITUser;
  /** userdata of the user who is navigating the application */
  @Input() currentUser: DiversITUser;
  /** list of all posts of the user who is viewed */
  @Input() posts: Post[];
  /** updates the boolen in the parent component which is responsible to either show the posts of a user or the user information */
  @Output() changeDetailsBoolean = new EventEmitter<boolean>();
  /** boolean which either shows the user information or the posts of a user */
  showUserDetails = false
  /** subscription to the viewed profile, used to later unsubscribe */
  profileIdSubscription;
  /** Can be most likely deleted. Is a leftover from earlier development */
  visible = true;


  /** boolean which shows, if the profile viewed already has a request to start a mentorship */
  openRequest: boolean;
  /** boolean which is true when the mentor has no more space for new mentees */
  userReachedMaxMentees: boolean = false;
  /** boolean which is set to true when the currentuser is a mentor and has his mentee limit reached */
  currentUserReachedMaxMentees: boolean = false;
  /** this boolean is set true, in case the currentuser is a male, and the mentor has set hist acceptancestatus to girls only */
  notSufficientForGirlsOnlyMentor: boolean = false;


  /**
   * receives the viewed user id from the route parameters
   *
   * @memberof ProfileHeadComponent
   */
  ngOnInit(): void {
    this.profileIdSubscription = this.route.snapshot.paramMap.get('id')
  }


  /**
   * lifecycle hook - called when a @input variable changes it's value.
   * 
   * In that case, the visibility of the button to send a mentorship request is reevaluated
   *
   * @param {SimpleChanges} changes
   * @memberof ProfileHeadComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentUser && changes.currentUser.currentValue) {
      this.checkButton()
    }
    if (changes.userOfProfile != null) {
      this.checkButton()
    }
  }


  /**
   * evaluates whether the request button to create a mentorship is disabled or not
   *
   * @memberof ProfileHeadComponent
   */
  checkButton() {
    if (this.userOfProfile && this.currentUser) {
      // if alreade mentor/mentee don't check any connecting realted stuff
      if(this.userOfProfile.mentees.includes(this.currentUser.uid) || this.userOfProfile.mentors.includes(this.currentUser.uid)) {
        return
      }
      this.notificationService.checkIfMentorRequestHasAlreadyBeenSent(this.userOfProfile.uid, this.currentUser.uid).then((data) => {
        // already has a request for Mentorship
        if (data != 0) this.openRequest = true;
        else this.openRequest = false;

        // User of Profile has maxMentees reached
        if (this.userOfProfile.maxMentees != -1 &&
          this.userOfProfile.mentees.length >= this.userOfProfile.maxMentees && 
          this.userOfProfile.girlsOnlyMentor == false &&
          this.openRequest == false) {
          this.userReachedMaxMentees = true
        }
        // personal maxMentees Überschritten
        else if (this.currentUser.maxMentees != -1 && 
          this.currentUser.mentees.length >= this.currentUser.maxMentees &&
          this.openRequest == false) {
          this.currentUserReachedMaxMentees = true
        }
        // GirlsOnly Mentor
        else if (this.userOfProfile.girlsOnlyMentor == true && 
          this.currentUser.gender !== "Weiblich" &&
          this.openRequest == false){
          this.notSufficientForGirlsOnlyMentor = true
        }
      })
    }
    else console.log("nullvalue on check")
  }



  /**
   * open Dialoge for adding mentor
   *
   * @memberof ProfileHeadComponent
   */
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
      if (result != null) {
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


  /**
   *
   *open dialog to affirm mentorship cancle
   * @memberof ProfileHeadComponent
   */
   cancleMentorship() {
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
      if (result != null) {
        // user wants to disconnect
        if (this.currentUser.role == 2) this.chatService.revokeRelationship(this.userOfProfile.uid, this.currentUser.uid)
        else this.chatService.revokeRelationship(this.currentUser.uid, this.userOfProfile.uid)

      }
    });
  }


  /**
   * redirectes to the chat with the viewed person
   *
   * @memberof ProfileHeadComponent
   */
  navigateToChatWithMentor() {
    this.router.navigate(['/chat', { k: this.userOfProfile.uid }]);
  }

  
  /**
   * redirects the user to its profile settings
   *
   * @memberof ProfileHeadComponent
   */
  navigateToProfileSetting() {
    this.router.navigate(['/profilesettings'])
  }

  /** toggles between showing the user details and the posts of a user */
  showDetails() {
    this.showUserDetails = !this.showUserDetails
    this.changeDetailsBoolean.emit()
  }

}
