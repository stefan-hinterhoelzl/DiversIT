import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
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

  currentThreads : Thread[] = [];
  numberOfShownThreads = 5;

  constructor(private database: ForumService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.database.getFirstThreads(this.numberOfShownThreads, "numberOfAnswers").then((data) => {
      this.currentThreads = data;
    }); 
  }

  getNextThreads() {
    this.database.getNextThreads(this.numberOfShownThreads, "numberOfAnswers").then((data) => {
      this.currentThreads = this.currentThreads.concat(data);
    })
  }

  ngOnChanges(changes: SimpleChanges){
   console.log(changes);
  }

  navigateToForumThread(forumId : number) {
    this.router.navigate(['/forum/' + forumId.toString()]);
  }

  createTestData(){
    this.currentThreads.push(<Thread>{
      uid: "5r0KI7OEWlRe7tu4axwa",
      created: Timestamp.fromDate(new Date("2021/12/10 9:31:00")),
      title: "Lohnt es sich zu studieren?",
      text: "",
      tags: ["18-24 Jahre", "Girls only", "BAKIP"],
      numberOfAnswers: 10,
      lastAnswerTime: Timestamp.fromDate(new Date("2021/12/11 13:09:00")),
      views: 25
    });    
    this.currentThreads.push(<Thread>{
      uid: "74HzI7Riehy1fX23lenk",
      created: Timestamp.fromDate(new Date("2021/12/8 13:43:00")),
      title: "Wie verwaltet ihr eure Kunden?",
      text: "",
      tags: ["Freelance", "Web"],
      numberOfAnswers: 0,
      lastAnswerTime: null,
      views: 3
    });  
    console.log(this.currentThreads);
  }

}