import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


/**
 * this service shows and hides a loading spinner
 *
 * @export
 * @class LoadingService
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /** creates a behaviorSubject of type boolean, which can be subscribed */
  private _loading = new BehaviorSubject<boolean>(false);
  /** turns the behaviorsubject into an observable */
  public readonly loading$ = this._loading.asObservable();


  /**
   * Creates an instance of LoadingService.
   * @memberof LoadingService
   */
  constructor() {}


  /**
   * shows a loadingspinner
   *
   * @memberof LoadingService
   */
  show() {
    this._loading.next(true);
  }


  /**
   * hides the loading spinner
   *
   * @memberof LoadingService
   */
  hide() {
    this._loading.next(false);
  }
}
