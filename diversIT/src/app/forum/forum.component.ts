import { Component } from '@angular/core';


/**
 *  Forum overview
 *
 * @export
 * @class ForumComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent {

  filterText = "";
  filterTags = [];
  filterTypeNew = true;
  filterTypeDiscussedALot = false;
  filterTypeClickedOften = false;
  currentPage = 1;
  resetPageNumCounter : number;


  /**
   * Creates an instance of ForumComponent.
   * @memberof ForumComponent
   */
  constructor() { }


  /**
   * sets global variable of this file
   *
   * @param {string} event
   * @memberof ForumComponent
   */
  setFilterText(event: string) {
    this.filterText = event;
  }


  /**
   * sets global variable of this file
   *
   * @param {string[]} event
   * @memberof ForumComponent
   */
  setFilterTags(event: string[]) {
    this.filterTags = event;
  }


  /**
   *
   * sets flobal variable of this file
   * @param {string} event
   * @memberof ForumComponent
   */
  setFilterType(event: string) {
    this.filterTypeNew = (event === "new") ? true : false;
    this.filterTypeDiscussedALot = (event === "discussedALot") ? true : false;
    this.filterTypeClickedOften = (event === "oftenClicked") ? true : false;
  }
  

  /**
   * sets the global variable currentPage to the pagenumber which should be displayed
   *
   * @param {number} event
   * @memberof ForumComponent
   */
  setCurrentPage(event: number) {
    this.currentPage = event;
  }
  

  /**
   * sets the global variable resetPageNumCounter to the number of the event
   * @param {number} event
   * @memberof ForumComponent
   */
  resetPageNum(event: number) {
    this.resetPageNumCounter = event;
  }
}
