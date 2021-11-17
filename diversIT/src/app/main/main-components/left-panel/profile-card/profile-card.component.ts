import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {

  constructor(private router: Router) { }

  @Input() userID: string;
  @Input() name: string;
  @Input() profileImg: string;
  @Input() description: string;



  redirectToProfile() {
    this.router.navigate(['/profile/' + this.userID])
  }

}
