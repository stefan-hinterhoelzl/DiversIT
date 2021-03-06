import { UserServiceStub } from './../../../services/user.service.mock';
import { UserService } from 'src/app/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DiversITUser } from 'src/app/models/users.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { MentorSpotlightComponent } from './mentor-spotlight.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StickyNavModule } from 'ng2-sticky-nav';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { AngularMaterialModule } from 'src/app/angular-material-module';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('MentorSpotlightComponent', () => {
  let component: MentorSpotlightComponent;
  let fixture: ComponentFixture<MentorSpotlightComponent>;
  let compiled: HTMLElement;
  let getAllMentorsPromiseSpy: jasmine.Spy;

  let promisedData = [UserServiceStub.getDummyMentor1(), UserServiceStub.getDummyMentor1()];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MentorSpotlightComponent],
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
    fixture = TestBed.createComponent(MentorSpotlightComponent);
    component = fixture.componentInstance;

    getAllMentorsPromiseSpy = spyOn(component['userService'], 'getAllMentorsPromise').and.returnValue(Promise.resolve(promisedData));

    fixture.detectChanges();

    // check spy works
    expect(getAllMentorsPromiseSpy).toHaveBeenCalled();

    compiled = fixture.nativeElement;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(compiled.querySelector('.container.section-title h2').textContent).toBe('Mentorinnen Spotlight');
  });

  it('should render 1 mentor when more than 1 are returned', () => {
    expect(compiled.querySelectorAll('mat-card')).toHaveSize(1);
  });
});
