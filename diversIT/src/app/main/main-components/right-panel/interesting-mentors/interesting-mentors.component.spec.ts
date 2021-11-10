import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestingMentorsComponent } from './interesting-mentors.component';

describe('InterestingMentorsComponent', () => {
  let component: InterestingMentorsComponent;
  let fixture: ComponentFixture<InterestingMentorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestingMentorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestingMentorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
