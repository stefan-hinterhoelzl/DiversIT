import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { ForumService } from '../services/forum.service';

import { ForumThreadComponent } from './forum-thread.component';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { Thread } from '../models/forum.model';

describe('ForumThreadComponent', () => {
  let component: ForumThreadComponent;
  let fixture: ComponentFixture<ForumThreadComponent>;

  let data = {
    snapshot: {
      paramMap: convertToParamMap({
        id: "QwOPRzzeBxBS3wrw3LwC",
      })
    }}

    // some code which did not work for testing - i will elave it here anyways as a syntax template
  // class MockForumService{
  //   dataThread: Thread =  {
  //     uid: "string",
  //     created: null,
  //     title: "string",
  //     text: "string",
  //     tags: ["1", "2"],
  //     numberOfAnswers: 5,
  //     lastAnswerTime: null,
  //     views: 10,
  //   }
  //   async getThreadByUID(): Promise<Thread>{
  //     return this.dataThread
  //   }


  //   getAnswers(): Promise<Thread>{
  //     return null
  //   }
  // }
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumThreadComponent ],
      providers: [ 
        {provide: ActivatedRoute, useValue: data},
        // {provide: ForumService, useClass: MockForumService}
      ]
    })
    .compileComponents();
    let app = initializeApp(environment.firebaseConfig);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
