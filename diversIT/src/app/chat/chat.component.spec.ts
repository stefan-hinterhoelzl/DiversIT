import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { SnackbarComponent } from '../snackbar/snackbar.component';

import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  class MockSnackbar{

  }
  class MockRouter{

  }
  class MockActivatedRouter{

  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [ ChatComponent,
        {provide: SnackbarComponent, useClass: MockSnackbar},
        {provide: Router, useClass: MockRouter},
        {provide: ActivatedRoute, useClass: MockActivatedRouter}]
    })
    
    let app = initializeApp(environment.firebaseConfig);
    component = TestBed.inject(ChatComponent)
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(ChatComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
