import { UserServiceStub } from './../../../services/user.service.mock';
import { UserService } from 'src/app/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DiversITUser } from 'src/app/models/users.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { MentorSpotlightComponent } from './mentor-spotlight.component';

describe('MentorSpotlightComponent', () => {
  let component: MentorSpotlightComponent;
  let fixture: ComponentFixture<MentorSpotlightComponent>;
  let compiled: HTMLElement;
  let getAllMentorsPromiseSpy: jasmine.Spy;

  let mentor1 = {
    uid: 'dummyUID1',
    role: 2,
    firstname: 'Diana',
    lastname: 'Dummy',
    gender: 'Weiblich',
    girlsOnlyMentor: true,
    photoURL: '',
    job: 'DevOps Engineer',
    company: 'Dummy Inc.',
    primaryEducation: 'Primary school',
    secondaryEducation: 'Secondary school',
    universityEducation: 'University',
    backgroundInfo: ['dummy info 1', 'dummy info 2'],
    maxMentees: -1,
    mentees: []
  } as DiversITUser;

  let mentor2 = {
    uid: 'dummyUID2',
    role: 2,
    firstname: 'David',
    lastname: 'Dummier',
    gender: 'Männlich',
    girlsOnlyMentor: false,
    photoURL: '',
    job: 'DevOps Engineer',
    company: 'Dummy Inc.',
    primaryEducation: 'Primary school',
    secondaryEducation: 'Secondary school',
    universityEducation: 'University',
    backgroundInfo: ['dummy info 1', 'dummy info 2'],
    maxMentees: 1,
    mentees: ['dummyMenteeUID']
  } as DiversITUser;

  let promisedData = [mentor1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MentorSpotlightComponent],
      providers: [
        { provide: SnackbarComponent, useValue: {} },
        { provide: UserService, useClass: UserServiceStub }
      ],
      imports: [RouterTestingModule]
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
    getAllMentorsPromiseSpy.calls.mostRecent().returnValue.then(res => {
      expect(res).toEqual(promisedData);
      console.log(res);
    });

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

  it('should render 1 mentor', () => {
    expect(compiled.querySelectorAll('mat-card')).toHaveSize(1);
  });
});
