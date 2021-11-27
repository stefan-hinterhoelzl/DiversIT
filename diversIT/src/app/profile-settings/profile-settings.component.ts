import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

export class ProfileSettingsComponent implements OnInit {

  constructor(private firestore: UserService) { }

  // variables for possible values
  gender = ['Männlich', 'Weiblich', 'Divers'];
  job = ['IT-Systemadministrator', 'IT-Techniker', 'UX-Designer', 'Software Engineer', 'Universitätsprofessor für Informatik', 'Scrum Master', 'DevOps Engineer', 'Product Owner'].sort();;
  primaryEducation = ['Hauptschule', 'Gymnasium'];
  secondaryEducation = ['Gymnasium', 'HAK', 'HTL'];
  universityEducation = ['Bachelorstudium', 'Masterstudium', 'Doktorat'];

  // other variables
  currentUserSubscription: Subscription;
  currentUser: DiversITUser;
  currentUserRoleText = 'Unbekannt';

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.currentUserSubscription = this.firestore.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
        if(this.currentUser.role=1) this.currentUserRoleText = 'Admin';
        if(this.currentUser.role=2) this.currentUserRoleText = 'Mentor';
        if(this.currentUser.role=3) this.currentUserRoleText = 'Mentee';
      }
    });    
  }

  onSubmit() {
    this.firestore.UpdateCurrentUserAccount(this.currentUser);
  }

}