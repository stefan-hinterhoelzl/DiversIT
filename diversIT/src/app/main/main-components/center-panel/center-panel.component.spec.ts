import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { environment } from 'src/environments/environment';

import { CenterPanelComponent } from './center-panel.component';

describe('CenterPanelComponent', () => {
  let component: CenterPanelComponent;
  let fixture: ComponentFixture<CenterPanelComponent>;

  beforeEach(async () => {
    
    let app = initializeApp(environment.firebaseConfig);
    await TestBed.configureTestingModule({
      declarations: [ CenterPanelComponent ],
      providers: [
        {provide: SnackbarComponent, useValue: {}},
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
