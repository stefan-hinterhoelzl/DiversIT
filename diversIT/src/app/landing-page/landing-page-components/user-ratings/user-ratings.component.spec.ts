import { RatingServiceStub } from 'src/app/services/rating.service.mock';
import { Timestamp } from '@firebase/firestore';
import { Rating } from './../../../models/rating.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingService } from 'src/app/services/rating.service';
import { UserRatingsComponent } from './user-ratings.component';

describe('UserRatingsComponent', () => {
  let component: UserRatingsComponent;
  let fixture: ComponentFixture<UserRatingsComponent>;
  let compiled: HTMLElement;
  let getDisplayedRatingsSpy: jasmine.Spy;

  let rating1 = {
    displayOnLandingPage: true,
    userID: 'dummyUID',
    text: 'dummy text',
    summary: 'dummy summary',
    stars: 4,
    lastUpdated: Timestamp.fromMillis(1641729330299), // timestamp for date "09.01.2022"
    username: 'Max Mustermann'
  } as Rating;

  let promisedData = [rating1, rating1, rating1, rating1];

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

    // set input variable
    component.numberOfRatings = 3;

    getDisplayedRatingsSpy = spyOn(component['ratingService'], 'getDisplayedRatings').and.returnValue(Promise.resolve(promisedData));

    fixture.detectChanges();

    // check spy works
    expect(getDisplayedRatingsSpy).toHaveBeenCalled();
    getDisplayedRatingsSpy.calls.mostRecent().returnValue.then(res => {
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
    expect(compiled.querySelector('.container.section-title h2').textContent).toBe('Nutzererfahrungen');
  })

  it('should render 3 rating if more than 3 are returned', () => {
    expect(compiled.querySelectorAll('mat-accordion')).toHaveSize(1);
    expect(compiled.querySelectorAll('mat-accordion mat-expansion-panel')).toHaveSize(3);
  })

  it('should render 4 stars correctly', () => {
    let rating = compiled.querySelectorAll('mat-accordion mat-expansion-panel').item(0);
    let stars = rating.querySelectorAll('#stars mat-icon');
    expect(stars).toHaveSize(5);
    expect(stars.item(0).textContent.trim()).toEqual("star");
    expect(stars.item(1).textContent.trim()).toEqual("star");
    expect(stars.item(2).textContent.trim()).toEqual("star");
    expect(stars.item(3).textContent.trim()).toEqual("star");
    expect(stars.item(4).textContent.trim()).toEqual("star_border");
  })

  it('should render summary', () => {
    let rating = compiled.querySelectorAll('mat-accordion mat-expansion-panel').item(0);
    expect(rating.querySelector('#summary').textContent.trim()).toEqual("dummy summary");
  })

  it('should render text', () => {
    let rating = compiled.querySelectorAll('mat-accordion mat-expansion-panel').item(0);
    expect(rating.querySelector('#text').textContent.trim()).toEqual("dummy text");
  })

  it('should render username and date', () => {
    let rating = compiled.querySelectorAll('mat-accordion mat-expansion-panel').item(0);
    expect(rating.querySelector('#nameDate').textContent).toBe("– Max Mustermann, 09.01.2022");
  })
});
