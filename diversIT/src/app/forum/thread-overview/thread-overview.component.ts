import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Thread } from 'src/app/models/forum.model';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-thread-overview',
  templateUrl: './thread-overview.component.html',
  styleUrls: ['./thread-overview.component.scss']
})

export class ThreadOverviewComponent implements OnInit {

  @Input () inputFilterText = "";
  @Input () inputFilterTags = [];
  @Input () inputFilterTypeNew = true;
  @Input () inputFilterTypeDiscussedALot = false;
  @Input () inputFilterTypeClickedOften = false;
  @Input () inputCurrentPage = 1;
  @Output() resetPageNumEventEmitter = new EventEmitter<number>();

  allThreads: Thread[] = [];
  currentThreads : Thread[] = [];
  startIndex = -1;
  endIndex = -1;
  numberOfShownThreads = 5;
  numberOfMaxPage = 1;
  orderField = "";
  resetPageNumCounter = 1;

  constructor(private database: ForumService, private router: Router) { }

  private async getFirstThreads(orderByField: string){
    this.orderField = orderByField;
    await this.database.getFirstThreads(this.numberOfShownThreads, this.orderField).then((data) => {
      this.resetPageNumCounter++;
      this.resetPageNumEventEmitter.emit(this.resetPageNumCounter);
      this.startIndex = 0;
      this.endIndex = this.numberOfShownThreads;
      this.numberOfMaxPage = 1;
      this.allThreads = data;
      this.setCurrentThreads();
    }); 
  }

  ngOnInit(){
    this.getFirstThreads("created");
  }

  async getNextThreads() {
    await this.database.getNextThreads(this.numberOfShownThreads, this.orderField).then((data) => {
      this.allThreads = this.allThreads.concat(data);
    })
  }

  private setCurrentThreads(){
    this.currentThreads = [];
    for (let i = this.startIndex; i < this.endIndex; i++) {
      if(this.allThreads[i] != null) this.currentThreads.push(this.allThreads[i]);
    }
  }

  private determineThreadsFromAndToIndex(increase: boolean) {
    if(increase) {
      this.startIndex += this.numberOfShownThreads;
      this.endIndex += this.numberOfShownThreads;
    } else {
      this.startIndex -= this.numberOfShownThreads;
      this.endIndex -= this.numberOfShownThreads;
    }
    console.log(this.startIndex);
    console.log(this.endIndex);
    this.setCurrentThreads();
  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes);
    if ((changes.inputFilterTypeNew != null) && (changes.inputFilterTypeNew.currentValue === true)) this.getFirstThreads("created"); 
    if ((changes.inputFilterTypeDiscussedALot != null) && (changes.inputFilterTypeDiscussedALot.currentValue === true)) this.getFirstThreads("numberOfAnswers");
    if ((changes.inputFilterTypeClickedOften != null) && (changes.inputFilterTypeClickedOften.currentValue === true)) this.getFirstThreads("views");
    if (changes.inputCurrentPage != null) {
      if(changes.inputCurrentPage.currentValue > this.numberOfMaxPage) {
        this.getNextThreads().then(() => {
          this.numberOfMaxPage = changes.inputCurrentPage.currentValue;
          this.determineThreadsFromAndToIndex((changes.inputCurrentPage.currentValue > changes.inputCurrentPage.previousValue));
        });
      } else {
        this.determineThreadsFromAndToIndex((changes.inputCurrentPage.currentValue > changes.inputCurrentPage.previousValue));
      }
    }
  }

  navigateToForumThread(forumId : number) {
    this.router.navigate(['/forum/' + forumId.toString()]);
  }

}