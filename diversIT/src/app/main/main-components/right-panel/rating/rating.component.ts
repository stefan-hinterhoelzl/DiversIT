import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  emailString: string;

  constructor() {
  }

  ngOnInit() {
    this.ratingForm = new FormGroup({
      text: new FormControl(''),
    })
  }

  onRatingChanged(rating) {
    console.log(rating);
    this.rating = rating;
    this.emailString = "mailto:diversit.plattform@gmail.com?Subject=" + this.rating + "-Sterne Bewertung&body=";
  }


}

