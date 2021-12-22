import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';

describe('RtdbService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
