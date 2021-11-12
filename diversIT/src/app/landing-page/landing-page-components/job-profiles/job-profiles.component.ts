import { MatTableDataSource } from '@angular/material/table';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { JobProfile } from 'src/app/models/job-profile.model';

@Component({
  selector: 'app-job-profiles',
  templateUrl: './job-profiles.component.html',
  styleUrls: ['./job-profiles.component.scss']
})
export class JobProfilesComponent implements OnInit {

  jobProfiles: JobProfile[]
  dataSourceJobProfiles: any
  displayedColumns: string[] = ['title', 'shortDescription', 'tasks'];

  constructor(private firestore: FirestoreService) { }

  async ngOnInit(): Promise<void> {
    this.jobProfiles = await this.firestore.getAllJobProfilesPromise();

    this.dataSourceJobProfiles = new MatTableDataSource(this.jobProfiles);
  }

}
