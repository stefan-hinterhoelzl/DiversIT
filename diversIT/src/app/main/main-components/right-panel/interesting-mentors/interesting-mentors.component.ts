import { Component, OnInit } from '@angular/core';
import { DiversITUser } from 'src/app/models/users.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-interesting-mentors',
  templateUrl: './interesting-mentors.component.html',
  styleUrls: ['./interesting-mentors.component.scss']
})

export class InterestingMentorsComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  mentors: DiversITUser[] = [];
  tempMentors: DiversITUser[] = []; 

  ngOnInit(): void {
    this.firestore.getAllInterestingMentorsPromise().then(data => {
      this.tempMentors = data; 
      if(this.tempMentors != null){
        for (let i = 0; i < 3; i++) {
          if(this.tempMentors.length > 0) {
            let randomNumber = Math.floor(Math.random() * this.tempMentors.length);
            this.mentors.push(this.tempMentors[randomNumber]);
            this.tempMentors.splice(randomNumber,1);
          }
        }
      }
    });
  }

}
