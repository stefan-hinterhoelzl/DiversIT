import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-page-selection',
  templateUrl: './page-selection.component.html',
  styleUrls: ['./page-selection.component.scss']
})
export class PageSelectionComponent implements OnInit {

  currentPage = 1;
  numberOfThreadsToShow = 5;
  numberOfPages : number;

  @Output() currentPageEventEmitter = new EventEmitter<number>();

  constructor(private database: ForumService) { }

  ngOnInit(): void {
    this.determineNumberOfPages();
  }

  determineNumberOfPages(){
    this.database.getNumberOfThreads().then((numOfThreads) => {
      let restValue : number = numOfThreads % this.numberOfThreadsToShow;
      let result : number = numOfThreads / this.numberOfThreadsToShow;
      this.numberOfPages = parseInt(result.toString());
      if(restValue > 0) this.numberOfPages++;
    });
  }

  decreasePageNum(){
    if(this.currentPage === 1) return; 
    this.currentPage--;
    this.currentPageEventEmitter.emit(this.currentPage);
  }

  increasePageNum(){
    if(this.currentPage === this.numberOfPages) return; 
    this.currentPage++;
    this.currentPageEventEmitter.emit(this.currentPage);
  }

}
