import { DiversITUser } from './../../../models/users.model';
import { FirestoreService } from './../../../services/firestore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mentor-spotlight',
  templateUrl: './mentor-spotlight.component.html',
  styleUrls: ['./mentor-spotlight.component.scss']
})
export class MentorSpotlightComponent implements OnInit {

  numberOfMentors = 1;
  mentors: DiversITUser[];

  constructor(private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.firestore.getAllMentorsPromise().then(data => {
      this.mentors = data.sort(() => .5 - Math.random()).slice(0, this.numberOfMentors);
    });
  }

}
