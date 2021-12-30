import { Timestamp } from '@firebase/firestore';
import { Rating } from './../../../models/rating.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingService } from 'src/app/services/rating.service';
import { RatingServiceStub } from 'src/app/services/rating.service.mock';

import { UserRatingsComponent } from './user-ratings.component';

describe('UserRatingsComponent', () => {
  let component: UserRatingsComponent;
  let fixture: ComponentFixture<UserRatingsComponent>;
  let compiled: HTMLElement;

  let rating1 = {
    displayOnLandingPage: true,
    userID: 'dummyUID',
    text: 'dummy text',
    summary: 'dummy summary',
    stars: 5,
    lastUpdated: Timestamp.fromDate(new Date('20.12.2021')),
    username: 'Max Mustermann'
  } as Rating;
  let promisedData = [rating1, rating1, rating1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRatingsComponent],
      providers: [{ provide: RatingService, useClass: RatingServiceStub }],
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;

    let spy = spyOn(component['ratingService'], 'getDisplayedRatings').and.returnValue(Promise.resolve(promisedData));
    component.ngOnInit();
    fixture.whenStable().then(res => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(compiled.querySelector('.container.section-title h2').textContent).toBe('Nutzererfahrungen');
  })

  it('should render 3 rating', () => {
    expect(compiled.querySelectorAll('mat-accordion')).toHaveSize(1);
    expect(compiled.querySelectorAll('mat-accordion mat-expansion-panel')).toHaveSize(3);
  })
});
