import { RouterModule } from '@angular/router';
import { DiversITUser } from './../../../models/users.model';
import { Rating } from './../../../models/rating.model';
import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { serverTimestamp } from 'firebase/firestore';
import { RatingService } from 'src/app/services/rating.service';


/**
 * component of the profile page which also contains the star rating component
 *
 * @export
 * @class RatingComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  /** some input/output data from/to parent component */
  @Input() currentUser: DiversITUser;
  @Input() ownProfile: boolean;
  @Output() starCount = 5;

  /** global variables */
  private rating: number;
  ratingForm: FormGroup;
  emailAdress = "diversit.plattform@gmail.com";
  displayForm = true;
  userRating: Rating;


  /**
   * Creates an instance of RatingComponent.
   * @param {SnackbarComponent} snackbar
   * @param {RatingService} ratingService
   * @param {RouterModule} router
   * @memberof RatingComponent
   */
  constructor(private snackbar: SnackbarComponent, private ratingService: RatingService, private router: RouterModule) {
  }


  /**
   * lifecycle hook - creates a formgroup
   *
   * @memberof RatingComponent
   */
  ngOnInit() {
    this.ratingForm = new FormGroup({
      summary: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    });
  }

  /** listens for changes of the input date from the parent and updates the rating form content if needed */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentUser && changes.currentUser.currentValue) {
      this.prefillRating();
    }
  }


  /**
   * fills the rating form with requested data from database.
   *
   * @memberof RatingComponent
   */
  async prefillRating() {
    await this.ratingService.getRatingForUserID(this.currentUser.uid).then((data) => {
      if (data != null) {
        this.userRating = data;
        this.ratingForm.get('summary').setValue(this.userRating.summary);
        this.ratingForm.get('text').setValue(this.userRating.text);
        this.rating = this.userRating.stars;
      }
    })
  }

  /** updates the global rating variable */
  onRatingChanged(rating: number) {
    console.log(rating);
    this.rating = rating;
  }

  /** persists the formdata on the database. Either updates or inserts the rating entry. */
  saveRating() {
    if (this.isFormDataComplete()) {
      let ratingPayload = <Rating>{
        stars: this.rating,
        summary: this.ratingForm.get('summary').value,
        text: this.ratingForm.get('text').value,
        lastUpdated: serverTimestamp(),
        userID: this.currentUser.uid,
        username: this.currentUser.firstname + " " + this.currentUser.lastname,
        displayOnLandingPage: false,
      }
      this.ratingService.updateRating(ratingPayload).then(() => {
        this.snackbar.openSnackBar("Danke für dein Feedback!", "green-snackbar");
        this.reset();
        this.displayForm = false;
      }).catch(() => {
        this.snackbar.openSnackBar("Da ist wohl etwas schief gegangen! Bitte versuche es später nochmal.", "snackbar-red");
      });
    }
  }

  /** check if form is valid */
  isFormDataComplete(): boolean {
    if (this.rating == null || this.rating == 0 || this.ratingForm.get('summary').value
      .trim() == '' || this.ratingForm.get('text').value.trim() == '') {
      this.snackbar.openSnackBar("Alle Formularfelder sind verpflichtend auszufüllen.", "red-snackbar");
      return false;
    } else return true;
  }

  /** resets the form if needed */
  reset() {
    this.rating = null;
    this.ratingForm.reset();
  }
}

