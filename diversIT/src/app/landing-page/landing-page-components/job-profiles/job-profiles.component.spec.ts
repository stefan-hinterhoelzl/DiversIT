import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProfilesComponent } from './job-profiles.component';

describe('JobProfilesComponent', () => {
  let component: JobProfilesComponent;
  let fixture: ComponentFixture<JobProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
