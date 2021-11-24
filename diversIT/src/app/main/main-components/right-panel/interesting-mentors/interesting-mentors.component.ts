import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DiversITUser } from 'src/app/models/users.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-interesting-mentors',
  templateUrl: './interesting-mentors.component.html',
  styleUrls: ['./interesting-mentors.component.scss']
})

export class InterestingMentorsComponent implements OnInit {

  constructor(private firestore: UserService, private router: Router) { }
  @Input() width: "16%";
  mentors: DiversITUser[] = [];
  tempMentors: DiversITUser[] = [];

  ngOnInit(): void {
    this.firestore.getAllInterestingMentorsPromise().then(data => {
      this.tempMentors = data;
      if (this.tempMentors !== null) {
        for (let i = 0; i < 3; i++) {
          if (this.tempMentors.length > 0) {
            let randomNumber = Math.floor(Math.random() * this.tempMentors.length);
            this.mentors.push(this.tempMentors[randomNumber]);
            this.tempMentors.splice(randomNumber, 1);
          }
        }
      }
    });
  }

}
