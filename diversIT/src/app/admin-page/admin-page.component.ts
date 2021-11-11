import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiversITUser } from '../models/users.model';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  users: DiversITUser[]
  dataSourceMentees: any
  dataSourceMentors: any
  dataSourceAdmins: any
  displayedColumnsAdmins: string[] = ['email', 'lastLogin', 'creationDate'];
  displayedColumns: string[] = ['email', 'lastLogin', 'creationDate'];

  constructor(private firestore: FirestoreService) { }

  async ngOnInit(): Promise<void> {
    this.users = await this.firestore.getAllUsersPromise();

    this.dataSourceMentees = new MatTableDataSource(this.users.filter((element) => element.role == 3))
    this.dataSourceMentors = new MatTableDataSource(this.users.filter((element) => element.role == 2))
    this.dataSourceAdmins = new MatTableDataSource(this.users.filter((element) => element.role == 1))
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



}
