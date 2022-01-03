import { ComponentFixture, TestBed } from '@angular/core/testing';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

import { UserRatingsComponent } from './user-ratings.component';

describe('UserRatingsComponent', () => {
  let component: UserRatingsComponent;
  let fixture: ComponentFixture<UserRatingsComponent>;

  beforeEach(async () => {
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ UserRatingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
