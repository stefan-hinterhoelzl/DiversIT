import { Component, OnInit } from '@angular/core';
import { DiversITUser } from 'src/app/models/users.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-center-panel',
  templateUrl: './center-panel.component.html',
  styleUrls: ['./center-panel.component.scss']
})
export class CenterPanelComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  currentUser: DiversITUser;
  mentors: string[];


  ngOnInit(): void {    
    this.firestore.currentUserStatus.subscribe((data) => {
      if (data != null) {
        this.currentUser = data
        this.initialize()
      }
    });
  }

  initialize(){
    this.mentors = this.currentUser.mentors
    
  }

}
