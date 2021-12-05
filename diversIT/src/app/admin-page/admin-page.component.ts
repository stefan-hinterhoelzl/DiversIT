import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Rating } from '../models/rating.model';
import { DiversITUser } from '../models/users.model';
import { RatingService } from '../services/rating.service';
import { UserService } from '../services/user.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';

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

  constructor(private userService: UserService, private ratingService: RatingService, private snackbar: SnackbarComponent) { }

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
    this.userService.promoteMenteeToMentor(element).then(() => {
      this.mentees = this.mentees.filter((x) => x.uid != element.uid)
      this.dataSourceMentees = new MatTableDataSource(this.mentees);
      this.mentors.push(element);
      this.dataSourceMentors = new MatTableDataSource(this.mentors);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "snackbar-red");
    });
  }

  demoteUserToMentee(element: DiversITUser) {
    this.userService.demoteMenteeToMentor(element).then(() => {
      this.mentors = this.mentors = this.mentors.filter((x) => x.uid != element.uid)
      this.dataSourceMentors = new MatTableDataSource(this.mentors);
      this.mentees.push(element);
      this.dataSourceMentees = new MatTableDataSource(this.mentees);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "snackbar-red");
    });
  }

  setRatingDisplayTrue(element: Rating) {
    this.ratingService.setDisplayTrue(element).then(() => {
      this.nonDisplayedRatings = this.nonDisplayedRatings.filter((x) => x.userID != element.userID)
      this.dataSourceNonDisplayedRatings = new MatTableDataSource(this.nonDisplayedRatings);
      this.displayedRatings.push(element);
      this.dataSourceDisplayedRatings = new MatTableDataSource(this.displayedRatings);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "snackbar-red");
    });
  }

  setRatingDisplayFalse(element: Rating) {
    this.ratingService.setDisplayFalse(element).then(() => {
      this.displayedRatings = this.displayedRatings.filter((x) => x.userID != element.userID)
      this.dataSourceDisplayedRatings = new MatTableDataSource(this.displayedRatings);
      this.nonDisplayedRatings.push(element);
      this.dataSourceNonDisplayedRatings = new MatTableDataSource(this.nonDisplayedRatings);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "snackbar-red");
    });
  }

}
