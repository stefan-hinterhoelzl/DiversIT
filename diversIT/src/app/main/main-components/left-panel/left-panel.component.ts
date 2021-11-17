import { Component, OnInit } from '@angular/core';
import { DiversITUser } from 'src/app/models/users.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InterestingMentorsComponent } from '../right-panel/interesting-mentors/interesting-mentors.component';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  constructor(private firestore: FirestoreService)  { }

  currentUser: DiversITUser = <DiversITUser>{
    firstname: "",
    lastname: "",
    photoURL: "",
    job: "",
    uid: ""
  };

  ngOnInit(): void {
    this.firestore.currentUserStatus.subscribe(data => {
      if (data === null) return;
      this.currentUser = data;
    })

  }

}
