import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-filter-sort',
  templateUrl: './search-filter-sort.component.html',
  styleUrls: ['./search-filter-sort.component.scss']
})
export class SearchFilterSortComponent implements OnInit {

  filterText = "";

  filterTags = ['HTL', 'HAK', 'BAKIP', 'Girls only', 'Freelance', 'Web', '18-24 Jahre'];
  selectedFilterTags = [];

  filterTypeNew = false;
  filterTypeDiscussedALot = false;
  filterTypeClickedOften = false;

  constructor() { }

  ngOnInit(): void {
    this.filterTypeNew = true;
  }

  changeFilterType(type : String){
    this.filterTypeNew = (type === "new") ? true : false;
    this.filterTypeDiscussedALot = (type === "discussedALot") ? true : false;
    this.filterTypeClickedOften = (type === "oftenClicked") ? true : false;
  }

  getFilterType(){
    if(this.filterTypeNew) return "new";
    if(this.filterTypeDiscussedALot) return "discussedALot";
    if(this.filterTypeClickedOften) return "oftenClicked";
  }

}
