import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarComponent } from 'src/app/snackbar/snackbar.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input('rating') rating: number;
  @Input('starCount') starCount = 5;
  @Input('color') color = "accent";
  ratingForm: FormGroup;
  emailAdress = "diversit.plattform@gmail.com";

  constructor(private snackbar: SnackbarComponent) {
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

  sendEmail() {
    if (this.rating == null || this.rating == 0 || this.ratingForm.get('summary').value
      .trim() == '' || this.ratingForm.get('text').value.trim() == '') {
      this.snackbar.openSnackBar("Alle Formularfelder sind verpflichtend auszufüllen.", "red-snackbar");
      return;
    }
    window.open(`mailto:${this.emailAdress}?Subject=${this.rating}-Sterne Bewertung: ${this.ratingForm.get('summary').value.trim()}&body=${this.ratingForm.get('text').value.trim()}`);
    this.rating = null;
    this.ngOnInit();
  }

}

