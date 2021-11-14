import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-profiles',
  templateUrl: './job-profiles.component.html',
  styleUrls: ['./job-profiles.component.scss']
})
export class JobProfilesComponent implements OnInit {

  breakpoint: number;

  constructor() { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 1363) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1363) ? 1 : 2;
  }

}
