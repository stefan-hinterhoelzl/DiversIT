import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiversITUser } from '../models/users.model';
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

  constructor(private firestore: UserService, private snackbar: SnackbarComponent) { }

  async ngOnInit(): Promise<void> {
    this.users = await this.firestore.getAllUsersPromise();

    this.admins = this.users.filter((element) => element.role == 1)
    this.mentees = this.users.filter((element) => element.role == 3)
    this.mentors = this.users.filter((element) => element.role == 2)

    this.dataSourceMentees = new MatTableDataSource(this.mentees)
    this.dataSourceMentors = new MatTableDataSource(this.mentors)
    this.dataSourceAdmins = new MatTableDataSource(this.admins)
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
    this.firestore.promoteMenteeToMentor(element).then(() => {
      this.mentees = this.mentees.filter((x) => x.uid != element.uid)
      this.dataSourceMentees = new MatTableDataSource(this.mentees);
      this.mentors.push(element);
      this.dataSourceMentors = new MatTableDataSource(this.mentors);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "snackbar-red");
    });
  }

  demoteUserToMentee(element: DiversITUser) {
    this.firestore.demoteMenteeToMentor(element).then(() => {
      this.mentors = this.mentors = this.mentors.filter((x) => x.uid != element.uid)
      this.dataSourceMentors = new MatTableDataSource(this.mentors);
      this.mentees.push(element);
      this.dataSourceMentees = new MatTableDataSource(this.mentees);
    }).catch(() => {
      this.snackbar.openSnackBar("Aktion fehlgeschlagen", "snackbar-red");
    });
  }


}
