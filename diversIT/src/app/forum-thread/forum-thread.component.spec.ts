import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumThreadComponent } from './forum-thread.component';

describe('ForumThreadComponent', () => {
  let component: ForumThreadComponent;
  let fixture: ComponentFixture<ForumThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumThreadComponent ]
    })
    .compileComponents();
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
