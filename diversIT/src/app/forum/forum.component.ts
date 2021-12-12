import { Router } from '@angular/router';
import { ObserversService } from './../services/observers.service';
import { ForumService } from './../services/forum.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Thread } from '../models/forum.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  allThreads: Thread[] = [];
  allThreadsSubscription: Subscription;

  threadunsub;

  constructor(private database: ForumService, private observer: ObserversService, private router: Router) { }

  ngOnInit(): void {
    this.allThreadsSubscription = this.observer.threadStatus.subscribe((data) => {
      if (data.length > 0) {
        this.allThreads = data;
        console.log(this.allThreads);
      }
    });
    if (this.allThreads != null) {
      this.initialize();
    }
  }

  initialize() {
    this.threadunsub = this.database.getThreads();
  }

  // route and compontent is not set up yet
  navigateToThread(id: string) {
    this.router.navigate(["/forum/thread/" + id]);
  }

  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event) {
    this.threadunsub();
  }

  @HostListener('window:onunload', ['$event'])
  onUnloadHandler(event) {
    this.threadunsub();
  }

  // TODO: remove after testing
  testCreateDummyThread() {
    console.log("testCreateDummyThread method was called");
    this.database.createThread("title test dummy thread", "this is the dummy question text. can you please help me?", ["dummy", "test"]);
  }

  testCreateAnswerForDummyThread(threadUID: string) {
    console.log("testCreateAnswerForDummyThread method was called");
    this.database.createAnswer(threadUID, "dummy answer to a dummy question");
  }

}
