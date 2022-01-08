import { ChatServiceStub } from 'src/app/services/chat.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { SnackbarComponent } from './../../../snackbar/snackbar.component';
import { ObserversServiceStub } from './../../../services/observers.service.mock';
import { ObserversService } from 'src/app/services/observers.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceStub } from 'src/app/services/auth.service.mock';

import { NavbarComponent } from './navbar.component';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let compiled: HTMLElement;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: SnackbarComponent, useValue: {} },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ObserversService, useClass: ObserversServiceStub },
        { provide: ChatService, useClass: ChatServiceStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCurrentUserStatus of ObserversService on component Init', () => {
    let spy = spyOnProperty<any>(component['observer'], 'getCurrentUserStatus', 'get').and.callThrough();
    expect(spy).not.toHaveBeenCalled();
    component.ngOnInit();
    expect(component.currentUser.uid).toBe('dummyUID');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call unsubscribe on component Destroy', () => {
    let spy = spyOn<any>(component.currentUserSubscription, 'unsubscribe').and.callThrough();
    expect(spy).not.toHaveBeenCalled();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render brand', () => {
    const navbarBrand = compiled.querySelector('a.navbar-brand');
    expect(navbarBrand).toBeTruthy();
    expect(navbarBrand.textContent).toBe('DiversIT');
  });

  it('should render all nav items in correct order when logged in', () => {
    const navItemsLoggedIn = compiled.querySelectorAll('ul li');
    expect(navItemsLoggedIn.length).toBe(7);

    expect(navItemsLoggedIn.item(0).textContent).toBe('Home');
    expect(navItemsLoggedIn.item(1).textContent).toBe('Mentor Spotlight');
    expect(navItemsLoggedIn.item(2).textContent).toBe('Job-Profile');
    expect(navItemsLoggedIn.item(3).textContent).toBe('Mission');
    expect(navItemsLoggedIn.item(4).textContent).toBe('Nutzererfahrungen');
    expect(navItemsLoggedIn.item(5).textContent).toBe('Forum');
    expect(navItemsLoggedIn.item(6).textContent).toBe('Ausloggen');
  });

  it('should render all nav items in correct order when logged out', () => {
    setUpLoggedOut();
    fixture.detectChanges();
    const navItemsLoggedOut = compiled.querySelectorAll('ul li');
    expect(navItemsLoggedOut.length).toBe(7);

    expect(navItemsLoggedOut.item(0).textContent).toBe('Home');
    expect(navItemsLoggedOut.item(1).textContent).toBe('Mentor Spotlight');
    expect(navItemsLoggedOut.item(2).textContent).toBe('Job-Profile');
    expect(navItemsLoggedOut.item(3).textContent).toBe('Mission');
    expect(navItemsLoggedOut.item(4).textContent).toBe('Nutzererfahrungen');
    expect(navItemsLoggedOut.item(5).textContent).toBe('Forum');
    expect(navItemsLoggedOut.item(6).textContent).toBe('Login');
  });

  it('should toggle loginApplied on click on Login', () => {
    setUpLoggedOut();

    spyOn(component, 'toggleLogin').and.callThrough();

    const loginButton = debugElement.nativeElement.querySelector('#login .nav-link');
    expect(loginButton).toBeTruthy();
    expect(component.toggleLogin).not.toHaveBeenCalled();
    expect(component.loginApplied).toBeFalsy();

    loginButton.click();

    expect(component.loginApplied).toBeTruthy();
    expect(component.toggleLogin).toHaveBeenCalled();
    expect(component.toggleLogin).toHaveBeenCalledTimes(1);

    loginButton.click();
    expect(component.loginApplied).toBeFalsy();
    expect(component.toggleLogin).toHaveBeenCalledTimes(2);
  });

  function setUpLoggedOut() {
    spyOnProperty<any>(component['observer'], 'getCurrentUserStatus', 'get').and.callFake(() => {
      return of(null);
    });
    component.ngOnInit();
    expect(component.currentUser).toBeNull();
    fixture.detectChanges();
  }
});


