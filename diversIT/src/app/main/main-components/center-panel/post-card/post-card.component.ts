import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() userid: string;
  @Input() name: string;
  @Input() time: string;
  @Input() profileImg: string;
  @Input() content: string;
  @Input() contentImg: string;

  ngOnInit(): void {
    console.log(this.time)
  }



  navigateToProfile(){
    this.router.navigate(["profile/" + this.userid])
  }
}
