import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DiversITUser } from 'src/app/models/users.model';

@Component({
  selector: 'app-job-profiles',
  templateUrl: './job-profiles.component.html',
  styleUrls: ['./job-profiles.component.scss']
})
export class JobProfilesComponent implements OnInit {

  breakpoint: number;
  numberOfMentors = 3;
  selectedItems: string[] = ['DevOps Engineer', 'Universitätsprofessor für Informatik', 'Product Owner', 'IT-Systemadministrator'];
  jobProfiles = new FormControl(this.selectedItems);
  jobProfilesList: string[] = ['IT-Systemadministrator', 'IT-Techniker', 'UX-Designer', 'Software Engineer', 'Universitätsprofessor für Informatik', 'Scrum Master', 'DevOps Engineer', 'Product Owner'].sort();
  mentors: DiversITUser[];
  jobProfilesMentorsMap: Map<string, DiversITUser[]>;

  constructor(private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.breakpoint = (window.innerWidth <= 1220) ? 1 : 2;
    this.initializeJobProfilesMentorsMap(this.jobProfilesList);

    await this.userService.getAllMentorsPromise().then(data => {
      this.mentors = data;
    });

    this.setJobProfilesMentors(this.jobProfilesList, this.mentors);

  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1220) ? 1 : 2;
  }

  changeSelection(item: string) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(i => i != item);
    } else {
      this.selectedItems.push(item);
    }
  }

  changeSelectionEvent(event: Event) {
    let value = (event.target as HTMLSelectElement).value;
    if (this.selectedItems.includes(value)) {
      this.selectedItems = this.selectedItems.filter(i => i != value);
    } else {
      this.selectedItems.push(value);
    }
  }

  initializeJobProfilesMentorsMap(jobProfiles: string[]) {
    this.jobProfilesMentorsMap = new Map<string, DiversITUser[]>();
    jobProfiles.forEach(job => {
      this.jobProfilesMentorsMap.set(job, []);
    });
  }

  setJobProfilesMentors(jobProfiles: string[], mentors: DiversITUser[]): void {
    jobProfiles.forEach(job => {
      let jobMentors = mentors.filter(m => m.job === job);
      if (jobMentors.length > 1) {
        jobMentors = jobMentors.sort(() => .5 - Math.random()).slice(0, this.numberOfMentors);
      }
      this.jobProfilesMentorsMap.set(job, jobMentors);
    });
  }

  firstMentorHasImage(jobProfile: string): boolean {
    return this.jobProfilesMentorsMap
      && this.jobProfilesMentorsMap.get(jobProfile)
      && this.jobProfilesMentorsMap.get(jobProfile).length > 0
      && this.jobProfilesMentorsMap.get(jobProfile)[0].photoURL !== ''
      && this.jobProfilesMentorsMap.get(jobProfile)[0].photoURL !== 'unknown';
  }

}
