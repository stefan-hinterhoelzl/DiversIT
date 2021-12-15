import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, Thread } from '../models/forum.model';
import { ForumService } from '../services/forum.service';

@Component({
  selector: 'app-forum-thread',
  templateUrl: './forum-thread.component.html',
  styleUrls: ['./forum-thread.component.scss']
})
export class ForumThreadComponent implements OnInit {

  constructor(private route: ActivatedRoute, private forum: ForumService) { }

  threadId: string;
  thread: Thread;
  answers: Answer[];

  ngOnInit(): void {
    this.threadId = this.route.snapshot.paramMap.get('id')
    this.forum.getThreadByUID(this.threadId).then( (data: Thread) => {
        this.thread = data
      }
    )
    this.forum.getAnswers(this.threadId).then((data: Answer[]) => {
      this.answers = data;
    })
  }

}
