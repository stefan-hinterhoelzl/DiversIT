import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../snackbar/snackbar.component';

import { AuthguardService } from './authguard.service';

describe('AuthguardService', () => {
  let service: AuthguardService;

  beforeEach(() => {
    let app = initializeApp(environment.firebaseConfig);
    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: {}},
        {provide: SnackbarComponent, useValue: {}}
      ]
    });
    service = TestBed.inject(AuthguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
