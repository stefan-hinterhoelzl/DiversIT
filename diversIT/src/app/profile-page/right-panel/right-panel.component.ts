import { Component, Input } from '@angular/core';
import { DiversITUser } from 'src/app/models/users.model';
/**
 * This is just a component used for spacing at the moment, this space contains the right side of the component and holds ratings and maybe advertisement
 * 
 * profile page is split into four columns - this is one of them
 *
 * @export
 * @class RightPanelProfileComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-right-panel-profile',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelProfileComponent {
  /** A Userobject which is passed down to avoid fetching it again */
  @Input() currentUser: DiversITUser;
  /** The profile of the user navigating the Application. Used to check if the viewed profil is the own down the line. */
  @Input() ownProfile: boolean;


  
  /**
   * Creates an instance of RightPanelProfileComponent.
   * @memberof RightPanelProfileComponent
   */
  constructor() { }

}
