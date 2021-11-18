import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNewPostComponent } from './profile-new-post.component';

describe('ProfileNewPostComponent', () => {
  let component: ProfileNewPostComponent;
  let fixture: ComponentFixture<ProfileNewPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileNewPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileNewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
