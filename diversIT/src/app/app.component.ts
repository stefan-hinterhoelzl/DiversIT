import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mintistcool';

  constructor(private router: Router) {
  }

  isLandingPage() {
    return this.router.url == '/landing';
  }
}
