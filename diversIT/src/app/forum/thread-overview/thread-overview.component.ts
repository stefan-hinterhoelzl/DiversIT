import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-thread-overview',
  templateUrl: './thread-overview.component.html',
  styleUrls: ['./thread-overview.component.scss']
})

export class ThreadOverviewComponent implements OnInit {

  threads : Thread[] = [];

  constructor() { }

  ngOnInit(): void {
    this.createTestData();
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