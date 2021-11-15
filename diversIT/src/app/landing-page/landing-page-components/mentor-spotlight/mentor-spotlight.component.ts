import { FirestoreService } from './../../../services/firestore.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mentor-spotlight',
  templateUrl: './mentor-spotlight.component.html',
  styleUrls: ['./mentor-spotlight.component.scss']
})
export class MentorSpotlightComponent {

  constructor(private firestore: FirestoreService) { }

}
