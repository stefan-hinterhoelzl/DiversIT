import { ObserversService } from 'src/app/services/observers.service';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Overlay } from '@angular/cdk/overlay';
import { UserServiceStub } from './services/user.service.mock';
import { AuthService } from './services/auth.service';
import { AuthServiceStub } from './services/auth.service.mock';
import { ObserversServiceStub } from './services/observers.service.mock';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [SnackbarComponent, MatSnackBar, Overlay,
        { provide: UserService, useValue: UserServiceStub },
        { provide: AuthService, useValue: AuthServiceStub },
        { provide: ObserversService, useValue: ObserversServiceStub }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'diversit'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('diversit');
  });
});
