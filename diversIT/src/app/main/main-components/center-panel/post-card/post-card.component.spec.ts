import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

import { PostCardComponent } from './post-card.component';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  beforeEach(async () => {
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ PostCardComponent ],
      providers: [
        {provide: Router, useValue: {}},
        {provide: MatDialog, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
