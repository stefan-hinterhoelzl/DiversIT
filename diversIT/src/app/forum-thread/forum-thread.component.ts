import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, Thread } from '../models/forum.model';
import { ForumService } from '../services/forum.service';


/**
 * a single thread of the forum
 *
 * @export
 * @class ForumThreadComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-forum-thread',
  templateUrl: './forum-thread.component.html',
  styleUrls: ['./forum-thread.component.scss']
})
export class ForumThreadComponent implements OnInit {


  /**
   * Creates an instance of ForumThreadComponent.
   * @param {ActivatedRoute} route initializes ActivatedRoute which allows to get the rout and load the appropriate content
   * @param {ForumService} forum instance of the ForumService which is needed to get the required content.
   * @memberof ForumThreadComponent
   */
  constructor(private route: ActivatedRoute, private forum: ForumService) { }

  threadId: string;
  thread: Thread;
  answers: Answer[];


  /**
   * when the page is loaded, the route is inspected and the resulting id is 
   * sent to the forumservice which returns the question and all the answers to this thread.
   * 
   * Furthermore, the view counter of this entry is increased by one after succesfully loading.
   * @memberof ForumThreadComponent
   */
  ngOnInit(): void {
    this.threadId = this.route.snapshot.paramMap.get('id')
    this.forum.getThreadByUID(this.threadId).then((data: Thread) => {
      this.thread = data
    }
    )
    this.forum.getAnswers(this.threadId).then((data: Answer[]) => {
      this.answers = data;
    })
    this.forum.incrementThreadViews(this.threadId)
  }

}
