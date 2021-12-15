import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-selection',
  templateUrl: './page-selection.component.html',
  styleUrls: ['./page-selection.component.scss']
})
export class PageSelectionComponent implements OnInit {

  currentPage = 1;
  numberOfPages : number;

  constructor() { }

  ngOnInit(): void {
    this.determineNumberOfPages();
  }

  determineNumberOfPages(){
    // ToDo: Berechnen 
    this.numberOfPages = 5;
  }

  decreasePageNum(){
    if(this.currentPage === 1) return; 
    this.currentPage--;
  }

  increasePageNum(){
    if(this.currentPage === this.numberOfPages) return; 
    this.currentPage++;
  }

}
