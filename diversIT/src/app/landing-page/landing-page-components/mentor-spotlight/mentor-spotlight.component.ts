
import { DiversITUser } from './../../../models/users.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mentor-spotlight',
  templateUrl: './mentor-spotlight.component.html',
  styleUrls: ['./mentor-spotlight.component.scss']
})
export class MentorSpotlightComponent implements OnInit {

  numberOfMentors = 1;
  mentors: DiversITUser[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllMentorsPromise().then(data => {
      this.mentors = data.sort(() => .5 - Math.random()).slice(0, this.numberOfMentors);
    });
  }

}
