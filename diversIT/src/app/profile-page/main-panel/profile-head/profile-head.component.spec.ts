import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

import { ProfileHeadComponent } from './profile-head.component';

describe('ProfileHeadComponent', () => {
  let component: ProfileHeadComponent;
  let fixture: ComponentFixture<ProfileHeadComponent>;

  let routeData = {
    snapshot: {
      paramMap: convertToParamMap({
        id: "QwOPRzzeBxBS3wrw3LwC",
      })
    }}

  beforeEach(async () => {
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ ProfileHeadComponent ],
      providers: [
        {provide: SnackbarComponent, useValue: {}},
        {provide: Router, useValue: {}},
        {provide: ActivatedRoute, useValue: routeData},
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
