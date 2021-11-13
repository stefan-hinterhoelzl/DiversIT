import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss']
})
export class JobCardComponent implements OnInit {

  constructor() { }

  @Input() jobProfileID: string;
  @Input() title: string;
  @Input() shortDescription: string;
  @Input() tasks: string[];
  @Input() mentorUids: string[];


  ngOnInit(): void {
  }

}
