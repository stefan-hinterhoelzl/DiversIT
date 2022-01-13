import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../../../angular-material-module';
import { UserServiceStub } from './../../../services/user.service.mock';
import { UserService } from 'src/app/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

import { JobProfilesComponent } from './job-profiles.component';
import { DebugElement } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StickyNavModule } from 'ng2-sticky-nav';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('JobProfilesComponent', () => {
  let component: JobProfilesComponent;
  let fixture: ComponentFixture<JobProfilesComponent>;
  let compiled: HTMLElement;
  let debugElement: DebugElement;
  let getAllMentorsPromiseSpy: jasmine.Spy;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [JobProfilesComponent],
      providers: [
        { provide: SnackbarComponent, useValue: {} },
        { provide: UserService, useClass: UserServiceStub }
      ],
      imports: [
        RouterTestingModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        FlexLayoutModule,
        StickyNavModule,
        MatAutocompleteModule,
        FormsModule,
        ReactiveFormsModule,
        NgxScrollTopModule,
      ]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(JobProfilesComponent);
    component = fixture.componentInstance;

    getAllMentorsPromiseSpy = spyOn(component['userService'], 'getAllMentorsPromise').and.callThrough();

    fixture.detectChanges();

    // check spy works
    expect(getAllMentorsPromiseSpy).toHaveBeenCalled();

    compiled = fixture.nativeElement;
    debugElement = fixture.debugElement;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(compiled.querySelector('.section-title h2').textContent).toBe('Job-Profile in der IT');
  });

  it('should render 4 job profiles on initial load', () => {
    expect(compiled.querySelectorAll('mat-grid-list mat-card')).toHaveSize(4);
  });

  it('should render multiselect', () => {
    expect(compiled.querySelector('mat-form-field')).toBeTruthy();
  });

  it('should set breakpoint on window resize', () => {
    let spy = spyOn(component, 'onResize').and.callThrough();
    let event = new Event('resize');

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1220 });
    window.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.breakpoint).toBe(1);

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1221 });
    window.dispatchEvent(event);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.breakpoint).toBe(2);
  });

  it('should set breakpoint on init', () => {
    let spy = spyOn(component, 'ngOnInit').and.callThrough();
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1220 });
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.breakpoint).toBe(1);

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1221 });
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.breakpoint).toBe(2);
  });

  it('should initialize job profiles mentors map on init', () => {
    let spy = spyOn(component, 'initializeJobProfilesMentorsMap').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.jobProfilesMentorsMap).toBeTruthy();
    expect(component.jobProfilesMentorsMap.size).toBe(8);
  });

  it('should set job profiles mentors on init', async () => {
    let spy = spyOn(component, 'setJobProfilesMentors').and.callThrough();
    await component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.jobProfilesMentorsMap.get('DevOps Engineer').length).toBe(2);
    expect(component.jobProfilesMentorsMap.get('Product Owner').length).toBe(1);
  });

  it('changeSelection should remove selection', async () => {
    let spy = spyOn(component, 'changeSelection').and.callThrough();
    expect(component.selectedItems).toContain('DevOps Engineer');
    component.changeSelection('DevOps Engineer');
    expect(spy).toHaveBeenCalledWith('DevOps Engineer');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedItems).not.toContain('DevOps Engineer');
  });

  it('changeSelection should add selection', async () => {
    let spy = spyOn(component, 'changeSelection').and.callThrough();
    expect(component.selectedItems).not.toContain('Scrum Master');
    component.changeSelection('Scrum Master');
    expect(spy).toHaveBeenCalledWith('Scrum Master');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedItems).toContain('Scrum Master');
  });

  it('change selection event should trigger changeSelection', () => {
    let eventSpy = spyOn(component, 'changeSelectionEvent').and.callThrough();
    let spy = spyOn(component, 'changeSelection').and.callThrough();

    expect(component.selectedItems).toContain('DevOps Engineer');

    let selectElement = fixture.debugElement.query(By.css('mat-select'));
    selectElement.triggerEventHandler('change', { target: { value: 'DevOps Engineer' } });

    expect(eventSpy).toHaveBeenCalled();
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    fixture.detectChanges();

    expect(component.selectedItems).not.toContain('DevOps Engineer');
  });

});
