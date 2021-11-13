import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss']
})
export class JobCardComponent {

  constructor() { }

  @Input() jobProfileID: string;
  @Input() title: string;
  @Input() shortDescription: string;
  @Input() tasks: string[];
  @Input() mentorUids: string[];

}
