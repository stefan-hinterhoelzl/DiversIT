import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * landing Page of diversIT. This page is the base for all unauthenticated users and the place where faulty routes will be sent to. 
 *
 * @export
 * @class LandingPageComponent
 */
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  /**
   * Creates an instance of LandingPageComponent.
   * @memberof LandingPageComponent
   */
  constructor() { }

}
