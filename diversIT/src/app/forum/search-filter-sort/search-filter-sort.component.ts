import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter-sort',
  templateUrl: './search-filter-sort.component.html',
  styleUrls: ['./search-filter-sort.component.scss']
})
export class SearchFilterSortComponent implements OnInit {

  filterTags = ['HTL', 'HAK', 'BAKIP', 'Girls only', 'Freelance', 'Web', '18-24 Jahre'];

  filterTypeNew = true;
  filterTypeDiscussedALot = false;
  filterTypeClickedOften = false;

  @Output() filterTextEventEmitter = new EventEmitter<String>();
  @Output() filterTagsEventEmitter = new EventEmitter<String[]>();
  @Output() filterTypeEventEmitter = new EventEmitter<String>();

  sendFilterTextToParentItem(value: any) {
    this.filterTextEventEmitter.emit(value.value.toLowerCase());
  }

  sendFilterTagsToParentItem(value: String[]) {
    this.filterTagsEventEmitter.emit(value);
  }

  sendFilterTypeToParentItem(value: String) {
    this.filterTypeEventEmitter.emit(value);
  }

  constructor() { }

  ngOnInit(): void { }

  onSearchTextChanged(event: any){
    this.sendFilterTextToParentItem(event.target.value);
  }

  onFilterTagsChanged(event: any){
    this.sendFilterTagsToParentItem(event.value);
  }

  onFilterTypeChanged(type : String){
    this.filterTypeNew = (type === "new") ? true : false;
    this.filterTypeDiscussedALot = (type === "discussedALot") ? true : false;
    this.filterTypeClickedOften = (type === "oftenClicked") ? true : false;
    this.sendFilterTypeToParentItem(type);
  }

}
