import { DiversITUser } from './../../../models/users.model';
import { Rating } from './../../../models/rating.model';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';
import { serverTimestamp } from 'firebase/firestore';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() currentUser: DiversITUser;
  @Input() ownProfile: boolean;
  @Output() starCount = 5;
  private rating: number;
  ratingForm: FormGroup;
  emailAdress = "diversit.plattform@gmail.com";
  displayForm = true;

  constructor(private snackbar: SnackbarComponent, private ratingService: RatingService) {
  }

  ngOnInit() {
    this.ratingForm = new FormGroup({
      summary: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    });
  }

  onRatingChanged(rating) {
    console.log(rating);
    this.rating = rating;
  }

  saveRating() {
    if (this.isFormDataComplete()) {
      let ratingPayload = <Rating>{
        stars: this.rating,
        summary: this.ratingForm.get('summary').value,
        text: this.ratingForm.get('text').value,
        timestamp: serverTimestamp(),
        userID: this.currentUser.uid,
      }
      this.ratingService.addRating(ratingPayload);
      this.snackbar.openSnackBar("Danke für dein Feedback!", "green-snackbar");
      this.reset();
      this.displayForm = false;
    }
  }

  isFormDataComplete(): boolean {
    if (this.rating == null || this.rating == 0 || this.ratingForm.get('summary').value
      .trim() == '' || this.ratingForm.get('text').value.trim() == '') {
      this.snackbar.openSnackBar("Alle Formularfelder sind verpflichtend auszufüllen.", "red-snackbar");
      return false;
    } else return true;
  }

  reset() {
    this.rating = null;
    this.ratingForm.reset();
  }
}

