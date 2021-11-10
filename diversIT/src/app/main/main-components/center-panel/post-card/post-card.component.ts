import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {

  constructor(private router: Router) { }

  userid: string = "f0fi5AyuXMSlFcmmJTzErrRqFvx1";

  ngOnInit(): void {
  }



  navigateToProfile(){
    this.router.navigate(["profile/" + this.userid])
  }
}
