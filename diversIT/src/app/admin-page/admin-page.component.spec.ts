import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../snackbar/snackbar.component';

import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
  let component: AdminPageComponent;
  let fixture: ComponentFixture<AdminPageComponent>;


  class MockSnackbar{

  }
  class MockRouter{

  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ AdminPageComponent,
        {provide: SnackbarComponent, useClass: MockSnackbar},
        {provide: Router, useClass: MockRouter},]
    });    
    let app = initializeApp(environment.firebaseConfig);
    component = TestBed.inject(AdminPageComponent)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

