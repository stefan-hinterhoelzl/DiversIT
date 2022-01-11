import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularMaterialModule } from './../../../angular-material-module';
import { UserServiceStub } from './../../../services/user.service.mock';
import { UserService } from 'src/app/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

import { JobProfilesComponent } from './job-profiles.component';
import { DebugElement } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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

  it('should render 4 job profiles on pageload', () => {
    expect(compiled.querySelectorAll('mat-grid-list mat-card')).toHaveSize(4);
  });

  it('should render multiselect', () => {
    expect(compiled.querySelector('mat-form-field')).toBeTruthy();
  });
});
