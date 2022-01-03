import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

import { ThreadOverviewComponent } from './thread-overview.component';

describe('ThreadOverviewComponent', () => {
  let component: ThreadOverviewComponent;
  let fixture: ComponentFixture<ThreadOverviewComponent>;

  class MockRouter {

  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadOverviewComponent ],
      providers: [
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
    let app = initializeApp(environment.firebaseConfig);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
