import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let compiled;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      imports: [RouterTestingModule]
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
  })
});
