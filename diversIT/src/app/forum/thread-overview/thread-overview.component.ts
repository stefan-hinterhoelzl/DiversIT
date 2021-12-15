import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

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

  threads : Thread[] = [];

  constructor() { }

  ngOnInit(): void {
    this.createTestData();
    console.log(this.inputFilterText);
  }

  ngOnChanges(){
    console.log(this.inputFilterText);
    console.log(this.inputFilterTags);
    console.log(this.inputFilterTypeNew);
    console.log(this.inputFilterTypeDiscussedALot);
    console.log(this.inputFilterTypeClickedOften);
    console.log(this.inputCurrentPage);
  }

  createTestData(){
    this.threads.push(<Thread>{
      id: "1",
      answers: 10,
      invocations: 25,
      title: "Lohnt es sich zu studieren?",
      tags: ["18-24 Jahre", "Girls only", "BAKIP"],
      createdAt: Timestamp.fromDate(new Date("2021/12/10 9:31:00")),
      lastAnswer: Timestamp.fromDate(new Date("2021/12/11 13:09:00"))
    });    
    this.threads.push(<Thread>{
      id: "2",
      answers: 0,
      invocations: 3,
      title: "Wie verwaltet ihr eure Kunden?",
      tags: ["Freelance", "Web"],
      createdAt: Timestamp.fromDate(new Date("2021/12/8 13:43:00")),
      lastAnswer: null
    });  
    console.log(this.threads);
  }

}

// ToDo --> In Model auslagern
export interface Thread {
  id: string;
  answers: number;
  invocations: number;
  title: string;
  tags?: string[];
  createdAt: Timestamp;
  lastAnswer?: Timestamp;
}