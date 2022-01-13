import { AuthServiceStub } from 'src/app/services/auth.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { LoginBoxComponent } from './login-box.component';
import { AuthService } from '../services/auth.service';

describe('LoginBoxComponent', () => {
  let component: LoginBoxComponent;
  let fixture: ComponentFixture<LoginBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginBoxComponent],
      providers: [
        { provide: SnackbarComponent, useValue: {} },
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('socialLogin should call service with provider', () => {
    let spy = spyOn(component['auth'], 'socialLogin');

    component.socialLogin('google');
    expect(spy).toHaveBeenCalledWith('google');
  });

});
