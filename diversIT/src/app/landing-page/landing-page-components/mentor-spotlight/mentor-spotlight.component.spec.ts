import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorSpotlightComponent } from './mentor-spotlight.component';

describe('MentorSpotlightComponent', () => {
  let component: MentorSpotlightComponent;
  let fixture: ComponentFixture<MentorSpotlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MentorSpotlightComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
