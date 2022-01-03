import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

import { MentorSpotlightComponent } from './mentor-spotlight.component';

describe('MentorSpotlightComponent', () => {
  let component: MentorSpotlightComponent;
  let fixture: ComponentFixture<MentorSpotlightComponent>;

  beforeEach(async () => {
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ MentorSpotlightComponent ],
      providers: [
        {provide: SnackbarComponent, useValue: {}},
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
