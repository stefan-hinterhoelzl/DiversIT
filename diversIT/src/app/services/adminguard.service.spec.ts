import { TestBed } from '@angular/core/testing';

import { AdminguardService } from './adminguard.service';

describe('AdminguardService', () => {
  let service: AdminguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
