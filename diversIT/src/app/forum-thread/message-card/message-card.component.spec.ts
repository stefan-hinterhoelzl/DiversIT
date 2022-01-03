import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

import { MessageCardComponent } from './message-card.component';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  class MockMatDialog{

  }

  let routeData = {
    snapshot: {
      paramMap: convertToParamMap({
        id: "QwOPRzzeBxBS3wrw3LwC",
      })
    }}
  

  beforeEach(async () => {    
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ MessageCardComponent ],
      providers: [
        {provide: MatDialog, useClass: MockMatDialog},
        {provide: ActivatedRoute, useValue: routeData},
        {provide: Router, useValue: {}},
        {provide: SnackbarComponent, useValue:{}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
