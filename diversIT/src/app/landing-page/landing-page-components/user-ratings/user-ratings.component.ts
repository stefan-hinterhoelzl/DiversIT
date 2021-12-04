import { RatingService } from 'src/app/services/rating.service';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Rating } from 'src/app/models/rating.model';
import { Timestamp } from '@firebase/firestore';

@Component({
  selector: 'app-user-ratings',
  templateUrl: './user-ratings.component.html',
  styleUrls: ['./user-ratings.component.scss']
})
export class UserRatingsComponent implements OnInit {

  @Input() numberOfRatings: number;
  @Output() ratings: Rating[];

  constructor(private ratingService: RatingService) { }

  ngOnInit() {
    this.ratingService.getDisplayRatings().then((data) => {
      this.ratings = data.sort(() => .5 - Math.random()).slice(0, this.numberOfRatings)
    });
  }

  getFormattedDate(timestamp: Timestamp): string {
    let date = timestamp.toDate();
    let formattedDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    return formattedDate;
  }
}
