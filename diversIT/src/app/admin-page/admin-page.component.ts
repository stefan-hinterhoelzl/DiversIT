import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { httpsCallable } from 'firebase/functions';
import { Rating } from '../models/rating.model';
import { DiversITUser } from '../models/users.model';
import { LoadingService } from '../services/loading.service';
import { RatingService } from '../services/rating.service';
import { UserService } from '../services/user.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

/**
 * The Component of the Admin Page
 * @export
 * @class AdminPageComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {


  users: DiversITUser[]
  admins: DiversITUser[]
  mentees: DiversITUser[]
  mentors: DiversITUser[]
  dataSourceMentees: any
  dataSourceMentors: any
  dataSourceAdmins: any
  displayedColumnsAdmins: string[] = ['email', 'lastLogin', 'creationDate'];
  displayedColumns: string[] = ['email', 'lastLogin', 'creationDate', 'button'];

  ratings: Rating[]
  displayedRatings: Rating[]
  nonDisplayedRatings: Rating[]
  dataSourceDisplayedRatings: any
  dataSourceNonDisplayedRatings: any
  ratingDisplayedColumns: string[] = ['stars', 'summary', 'text', 'username', 'date', 'button'];


  constructor(private userService: UserService, private ratingService: RatingService, private snackbar: SnackbarComponent, private loading: LoadingService) { }
  /**
   * Creates an instance of AdminPageComponent.
   * @param {UserService} userService
   * @param {RatingService} ratingService
   * @param {SnackbarComponent} snackbar
   * @param {LoadingService} loading
   * @memberof AdminPageComponent
   */


  /**
   * exectues on initialization of component,
   * loads all users and splits them into each respective role and pushes the data into the tables
   * following the ratings of the users are gathered and also put into a table for user representation
   *
   * @return {*}  {Promise<void>}
   * @memberof AdminPageComponent
   */
  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getAllUsersPromise();

    this.admins = this.users.filter((element) => element.role == 1)
    this.mentees = this.users.filter((element) => element.role == 3)
    this.mentors = this.users.filter((element) => element.role == 2)

    this.dataSourceMentees = new MatTableDataSource(this.mentees)
    this.dataSourceMentors = new MatTableDataSource(this.mentors)
    this.dataSourceAdmins = new MatTableDataSource(this.admins)

    this.ratings = await this.ratingService.getAllRatings();
    this.displayedRatings = this.ratings.filter((element) => element.displayOnLandingPage === true).sort((a, b) => b.lastUpdated.toMillis() - a.lastUpdated.toMillis());
    this.nonDisplayedRatings = this.ratings.filter((element) => element.displayOnLandingPage === false).sort((a, b) => b.lastUpdated.toMillis() - a.lastUpdated.toMillis());

    this.dataSourceDisplayedRatings = new MatTableDataSource(this.displayedRatings)
    this.dataSourceNonDisplayedRatings = new MatTableDataSource(this.nonDisplayedRatings)
  }


  /**
   *
   * @param {Event} event
   * @memberof AdminPageComponent
   */
  applyFilterMentee(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMentees.filter = filterValue.trim().toLowerCase();
  }

  applyFilterMentors(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMentees.filter = filterValue.trim().toLowerCase();
  }

  applyFilterAdmins(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMentees.filter = filterValue.trim().toLowerCase();
  }

  promoteUserToMentor(element: DiversITUser) {
    this.loading.show()
    this.userService.promoteMenteeToMentor(element).then(() => {
      this.mentees = this.mentees.filter((x) => x.uid != element.uid)
      this.dataSourceMentees = new MatTableDataSource(this.mentees);
      this.mentors.push(element);
      this.dataSourceMentors = new MatTableDataSource(this.mentors);
      this.loading.hide()
      this.snackbar.openSnackBar("User "+element.firstname + " "+ element.lastname + " wurde die Rolle Mentor gegeben.", "green-snackbar")
    }).catch(() => {
      this.loading.hide()
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "red-snackbar");
    });
  }

  demoteUserToMentee(element: DiversITUser) {
    this.loading.show()
    this.userService.demoteMenteeToMentor(element).then(() => {
      this.mentors = this.mentors = this.mentors.filter((x) => x.uid != element.uid)
      this.dataSourceMentors = new MatTableDataSource(this.mentors);
      this.mentees.push(element);
      this.dataSourceMentees = new MatTableDataSource(this.mentees);
      this.loading.hide()
      this.snackbar.openSnackBar("User "+element.firstname + " "+ element.lastname + " wurde die Rolle Mentee gegeben.", "green-snackbar")
    }).catch(() => {
      this.loading.hide()
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "red-snackbar");
    });
  }

  setRatingDisplayTrue(element: Rating) {
    this.ratingService.setDisplayTrue(element).then(() => {
      this.nonDisplayedRatings = this.nonDisplayedRatings.filter((x) => x.userID != element.userID)
      this.dataSourceNonDisplayedRatings = new MatTableDataSource(this.nonDisplayedRatings);
      this.displayedRatings.push(element);
      this.dataSourceDisplayedRatings = new MatTableDataSource(this.displayedRatings);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "red-snackbar");
    });
  }

  setRatingDisplayFalse(element: Rating) {
    this.ratingService.setDisplayFalse(element).then(() => {
      this.displayedRatings = this.displayedRatings.filter((x) => x.userID != element.userID)
      this.dataSourceDisplayedRatings = new MatTableDataSource(this.displayedRatings);
      this.nonDisplayedRatings.push(element);
      this.dataSourceNonDisplayedRatings = new MatTableDataSource(this.nonDisplayedRatings);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "red-snackbar");
    });
  }

}
