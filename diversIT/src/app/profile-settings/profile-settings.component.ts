import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { ObserversService } from '../services/observers.service';
import { UserService } from '../services/user.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';


/**
 * Component of profile settings - does not have subcomponents
 *
 * @export
 * @class ProfileSettingsComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})

export class ProfileSettingsComponent implements OnInit, OnDestroy

{


  /**
   * Creates an instance of ProfileSettingsComponent.
   * @param {UserService} firestore
   * @param {ObserversService} observer
   * @param {SnackbarComponent} snackbar
   * @param {Router} router
   * @memberof ProfileSettingsComponent
   */
  constructor(private firestore: UserService, private observer: ObserversService, private snackbar: SnackbarComponent, private router: Router) { }

  /*variables for possible values*/
  gender = ['Männlich', 'Weiblich', 'Divers'];
  job = ['Schüler', 'Student', 'IT-Systemadministrator', 'IT-Techniker', 'UX-Designer', 'Software Engineer', 'Universitätsprofessor für Informatik', 'Scrum Master', 'DevOps Engineer', 'Product Owner'].sort();;
  primaryEducation = ['Hauptschule', 'Gymnasium'];
  secondaryEducation = ['Gymnasium', 'HAK', 'HTL'];
  universityEducation = ['Bachelorstudium', 'Masterstudium', 'Doktorat'];

  /** other variables */ 
  currentUserSubscription: Subscription;
  currentUser: DiversITUser;
  currentUserRoleText = 'Unbekannt';

  /** form */
  profileSettingsForm = new FormGroup({
    role: new FormControl(''),
    email: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    photoURL: new FormControl(''),
    maxMentees: new FormControl(''),
    girlsOnlyMentor: new FormControl(''),
    company: new FormControl(''),
    job: new FormControl(''),
    primaryEducation: new FormControl(''),
    secondaryEducation: new FormControl(''),
    universityEducation: new FormControl('')
  });

  /** lifecycle hook - unsubscribes current user */
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  /** lifecycle hook - subscribes to user, and prefills the form with the data of the user */
  ngOnInit(): void {
    this.currentUserSubscription = this.observer.currentUserStatus.subscribe((user) => {
      if (user != null) {
        this.currentUser = user;
        if (this.currentUser.role == 1) this.currentUserRoleText = 'Admin';
        if (this.currentUser.role == 2) this.currentUserRoleText = 'Mentor';
        if (this.currentUser.role == 3) this.currentUserRoleText = 'Mentee';
        this.profileSettingsForm.setValue({
          role: this.currentUserRoleText,
          email: this.currentUser.email,
          firstName: this.currentUser.firstname,
          lastName: this.currentUser.lastname,
          gender: this.currentUser.gender,
          photoURL: this.currentUser.photoURL,
          maxMentees: this.currentUser.maxMentees,
          girlsOnlyMentor: this.currentUser.girlsOnlyMentor,
          company: this.currentUser.company,
          job: this.currentUser.job,
          primaryEducation: this.currentUser.primaryEducation,
          secondaryEducation: this.currentUser.secondaryEducation,
          universityEducation: this.currentUser.universityEducation
        });
      }
    });
  }

  /** submits the form of the user - 
   * therefore, it takes the data of the form, overwrites the user object and calls a service method to update the user on the database */
  onSubmit() {
    if (!this.profileSettingsForm.valid) {
      this.snackbar.openSnackBar("Formular nicht korrekt ausgefüllt.", "red-snackbar");
      return;
    }
    this.currentUser.firstname = this.profileSettingsForm.get('firstName').value;
    this.currentUser.lastname = this.profileSettingsForm.get('lastName').value;
    this.currentUser.gender = this.profileSettingsForm.get('gender').value;
    this.currentUser.photoURL = this.profileSettingsForm.get('photoURL').value;
    this.currentUser.maxMentees = this.profileSettingsForm.get('maxMentees').value;
    this.currentUser.girlsOnlyMentor = this.profileSettingsForm.get('girlsOnlyMentor').value;
    this.currentUser.company = this.profileSettingsForm.get('company').value;
    if (this.profileSettingsForm.get('job').value != undefined) {
      this.currentUser.job = this.profileSettingsForm.get('job').value;
    } else {
      this.currentUser.job = "";
    }
    if (this.profileSettingsForm.get('primaryEducation').value != undefined) {
      this.currentUser.primaryEducation = this.profileSettingsForm.get('primaryEducation').value;
    } else {
      this.currentUser.primaryEducation = "";
    }
    if (this.profileSettingsForm.get('secondaryEducation').value != undefined) {
      this.currentUser.secondaryEducation = this.profileSettingsForm.get('secondaryEducation').value;
    } else {
      this.currentUser.secondaryEducation = "";
    }
    if (this.profileSettingsForm.get('universityEducation').value != undefined) {
      this.currentUser.universityEducation = this.profileSettingsForm.get('universityEducation').value;
    } else {
      this.currentUser.universityEducation = "";
    }

    console.log(this.currentUser)
    this.firestore.UpdateCurrentUserAccount(this.currentUser);
    this.snackbar.openSnackBar("Die Benutzerdaten wurden erfolgreich aktualisiert!", "green-snackbar");
    this.router.navigate(['/profile/' + this.currentUser.uid])
  }

}