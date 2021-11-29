import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  constructor() { }
  @Input() currentUser: DiversITUser;
  @Input() userOfProfile: DiversITUser;
  @Input() postsOfUser: Post[];
  showDetails: boolean = false;
  ngOnInit(): void {
    console.log(this.currentUser)
  }

  setDetailState(){
    this.showDetails = !this.showDetails
  }


}
