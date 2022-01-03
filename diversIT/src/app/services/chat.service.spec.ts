import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../snackbar/snackbar.component';

import { ChatService } from './chat.service';

describe('RtdbService', () => {
  let service: ChatService;

  beforeEach(() => {
    let app = initializeApp(environment.firebaseConfig);
    TestBed.configureTestingModule({
      providers: [
        {provide: SnackbarComponent, useValue: {}},
        {provide: Router, useValue: {}}
      ]
    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
