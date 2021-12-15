import { serverTimestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { ForumService } from './../services/forum.service';
import { Component, OnInit } from '@angular/core';
import { Answer, Thread } from '../models/forum.model';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  currentThreads: Thread[];

  constructor(private database: ForumService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.database.getFirstThreads(3, "numberOfAnswers").then((data) => {
      this.currentThreads = data;
    });
  }

  getNextThreads() {
    this.database.getNextThreads(3, "numberOfAnswers").then((data) => {
      this.currentThreads = this.currentThreads.concat(data);
    })
  }

  navigateToThread(id: string) {
    this.router.navigate(["/forum/" + id]);
  }

  // TODO: remove after testing
  testCreateDummyThread() {
    console.log("testCreateDummyThread method was called");
    const newThread = <Thread>{
      title: "title test dummy thread",
      text: "this is the dummy question text. can you please help me?",
      tags: ["dummy", "test"],
      created: serverTimestamp(),
    }
    this.database.createThread(newThread);
  }

  testCreateAnswerForDummyThread(threadUID: string) {
    console.log("testCreateAnswerForDummyThread method was called");
    const newAnswer = <Answer>{
      threadUID: threadUID,
      text: "this is the dummy question text. can you please help me?",
      timestamp: serverTimestamp(),
    }
    this.database.createAnswer(newAnswer);
  }

}
