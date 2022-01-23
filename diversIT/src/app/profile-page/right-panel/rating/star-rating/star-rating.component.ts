import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

/**
 * just the stars of the rating component
 *
 * @export
 * @class StarRatingComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StarRatingComponent implements OnInit {

  /** Date from/to parent component */
  @Input() rating: number;
  @Input() starCount: number;
  @Output() ratingUpdated = new EventEmitter();

  ratingArr = [];

  constructor() {
  }

  /** generates the correct amount of starts */
  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  /** tells the parent component that the rating has changed and also provides the new rating. */
  onClick(rating: number) {
    console.log(rating)
    this.ratingUpdated.emit(rating);
    return false;
  }

  /** necessary for HTML to show either a full star or just the outline */
  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
