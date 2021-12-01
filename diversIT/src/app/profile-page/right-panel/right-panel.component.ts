import { Component, Input, OnInit } from '@angular/core';
import { DiversITUser } from 'src/app/models/users.model';

@Component({
  selector: 'app-right-panel-profile',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelProfileComponent implements OnInit {

  @Input() currentUser: DiversITUser;
  @Input() ownProfile: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
