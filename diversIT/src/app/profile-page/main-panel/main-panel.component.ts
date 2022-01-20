import { Component, Input} from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { DiversITUser } from 'src/app/models/users.model';

/**
 *
 * This is just a component used for spacing at the moment, this space containes the posts of a user
 * 
 * profile page is split into four columns - this is one of them
 * @export
 * @class MainPanelComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent{


  /**
   * Creates an instance of MainPanelComponent.
   * @memberof MainPanelComponent
   */
  constructor() { }
  /** The userobject of the User navigation the Application */
  @Input() currentUser: DiversITUser;
  /** the user object of the profilepage the currentUser is viewing. */
  @Input() userOfProfile: DiversITUser;
  /** A list of postings of the user */
  @Input() postsOfUser: Post[];
  /** Boolean to show the correct Page. When false, all the postings are displayed, when true the user Information is displayed like education, gender and so on. */
  showDetails: boolean = false;



  /**
   * Switches the views of postings and profileinformation
   *
   * @memberof MainPanelComponent
   */
  setDetailState(){
    this.showDetails = !this.showDetails
  }


}
