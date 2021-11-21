import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-job-profiles',
  templateUrl: './job-profiles.component.html',
  styleUrls: ['./job-profiles.component.scss']
})
export class JobProfilesComponent implements OnInit {

  breakpoint: number;
  jobProfiles = new FormControl();
  jobProfilesList: string[] = ['IT-Systemadministrator', 'IT-Techniker', 'UX-Designer', 'Software Engineer', 'Universitätsprofessor für Informatik', 'Scrum Master', 'DevOps Engineer', 'Product Owner'].sort();
  selectedItems: string[] = ['DevOps Engineer', 'IT-Systemadministrator', 'Product Owner', 'UX-Designer'];


  constructor() { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 1363) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1363) ? 1 : 2;
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

}
