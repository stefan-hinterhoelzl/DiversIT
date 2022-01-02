import { Overlay } from '@angular/cdk/overlay';
import { ɵCodegenComponentFactoryResolver } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

import { JobProfilesComponent } from './job-profiles.component';

describe('JobProfilesComponent', () => {
  let component: JobProfilesComponent;
  let fixture: ComponentFixture<JobProfilesComponent>;

  class MockSnackbar{

  }

  class MockRouter{
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ JobProfilesComponent,
        {provide: SnackbarComponent, useClass: MockSnackbar},
        {provide: Router, useClass: MockRouter},
      ]

    })
    
    let app = initializeApp(environment.firebaseConfig);
    component = TestBed.inject(JobProfilesComponent)
    
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
