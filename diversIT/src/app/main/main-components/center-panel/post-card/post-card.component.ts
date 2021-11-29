import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from '@firebase/firestore';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {

  constructor(private router: Router) { }

  @Input() userid: string;
  @Input() name: string;
  @Input() time: Timestamp;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() contentImg: string;


  navigateToProfile() {
    this.router.navigate(["profile/" + this.userid])
  }
}
