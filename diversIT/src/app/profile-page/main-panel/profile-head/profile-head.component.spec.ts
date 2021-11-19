import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeadComponent } from './profile-head.component';

describe('ProfileHeadComponent', () => {
  let component: ProfileHeadComponent;
  let fixture: ComponentFixture<ProfileHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileHeadComponent ]
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
