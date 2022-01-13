import { NavbarComponent } from './landing-page-components/navbar/navbar.component';
import { FooterComponent } from './../footer/footer.component';
import { UserRatingsComponent } from './landing-page-components/user-ratings/user-ratings.component';
import { JobProfilesComponent } from './landing-page-components/job-profiles/job-profiles.component';
import { MentorSpotlightComponent } from './landing-page-components/mentor-spotlight/mentor-spotlight.component';
import { MissionComponent } from './landing-page-components/mission/mission.component';
import { SnackbarComponent } from './../snackbar/snackbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StickyNavModule } from 'ng2-sticky-nav';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { AngularMaterialModule } from '../angular-material-module';
import { AppRoutingModule } from '../app-routing.module';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
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
      ],
      providers: [
        { provide: MissionComponent, useValue: {} },
        { provide: FooterComponent, useValue: {} },
        { provide: NavbarComponent, useValue: {} },
        { provide: SnackbarComponent, useValue: {} },
        { provide: MentorSpotlightComponent, useValue: {} },
        { provide: JobProfilesComponent, useValue: {} },
        { provide: UserRatingsComponent, useValue: {} },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navbar', () => {
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
  });

  it('should render main banner', () => {
    expect(compiled.querySelector('.main-banner')).toBeTruthy();
  });

  it('should render mentor spotlight', () => {
    expect(compiled.querySelector('app-mentor-spotlight')).toBeTruthy();
  });

  it('should render job profiles', () => {
    expect(compiled.querySelector('app-job-profiles')).toBeTruthy();
  });

  it('should render mission', () => {
    expect(compiled.querySelector('app-mission')).toBeTruthy();
  });

  it('should render user ratings', () => {
    expect(compiled.querySelector('app-user-ratings')).toBeTruthy();
  });

  it('should render footer', () => {
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  // Main Banner
  it('should have some main banner text', () => {
    expect(compiled.querySelector('.main-banner .main-banner-text').textContent.length).toBeGreaterThan(0);
  });

  it('should have background on main banner', () => {
    const mainBanner = compiled.querySelector('.main-banner');
    expect(mainBanner).toHaveClass('item-bg-one');
    expect(getComputedStyle(mainBanner).backgroundImage).toContain('/assets/Images/landing-page_1920x1080.png');
  })

  it(`should have main banner button text 'Los geht's'`, () => {
    const button = compiled.querySelector('.main-banner .main-banner-text button');
    expect(button.textContent).toEqual(`Los geht's`);
  });

  it('should have main banner button attributes', () => {
    const button = compiled.querySelector('.main-banner .main-banner-text button');
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-primary');
    expect(button.getAttribute('mat-raised-button')).toBeDefined();
    expect(button.getAttribute('ng-reflect-router-link')).toBe('../app');
  })
});
