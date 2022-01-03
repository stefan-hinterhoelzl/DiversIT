import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

import { InterestingMentorsComponent } from './interesting-mentors.component';

describe('InterestingMentorsComponent', () => {
  let component: InterestingMentorsComponent;
  let fixture: ComponentFixture<InterestingMentorsComponent>;

  beforeEach(async () => {
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ InterestingMentorsComponent ],
      providers: [
        {provide: SnackbarComponent, useValue: {}},
        {provide: Router, useValue: {}}
      ]
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
