import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  class MockRouter {
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [  ],
      providers:[ LandingPageComponent,
        {provide: Router, useClass: MockRouter}
      ]
    });
    component = TestBed.inject(LandingPageComponent)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
