import { Component, OnInit } from '@angular/core';
import { DiversITUser } from '../models/users.model';
import { ObserversService } from '../services/observers.service';
import { UserService } from '../services/user.service';



/**
 * Component of relations page - does not have any subcomponents
 *
 * @export
 * @class RelationsPageComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-relations-page',
  templateUrl: './relations-page.component.html',
  styleUrls: ['./relations-page.component.scss']
})
export class RelationsPageComponent implements OnInit {


  /**
   * Creates an instance of RelationsPageComponent.
   * @param {UserService} userService
   * @param {ObserversService} observerService
   * @memberof RelationsPageComponent
   */
  constructor(private userService: UserService, private observerService: ObserversService) { }

  mentorList: DiversITUser[];
  currentUser: DiversITUser;
  showSpinner = true;


  /**
   * lifecycle hook - subscribes to current user, to mentors of user, or mentees of user - depending on role.
   *
   * @memberof RelationsPageComponent
   */
  ngOnInit(){
    this.observerService.currentUserStatus.subscribe((data) => {
      if(data === null) return;
      this.currentUser = data;

      if(this.currentUser.role == 3){
        this.userService.getCurrentUserMentors(this.currentUser).then((data: DiversITUser[]) => {
          if(data === null) return;
          this.mentorList = (data);
        })
      }
      else {
        this.userService.getCurrentUserMentees(this.currentUser).then((data: DiversITUser[]) => {
          if(data === null) return;
          this.mentorList = data;
        })
      }
      
    }) 
  }

  imageLoaded(){
    this.showSpinner = false;
  }
}
