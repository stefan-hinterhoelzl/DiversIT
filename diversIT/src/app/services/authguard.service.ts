import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { SnackbarComponent } from '../snackbar/snackbar.component';


/**
 * Class to guard specified routes from unauthorized users
 *
 * @export
 * @class AuthguardService
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {


  /**
   * Creates an instance of AuthguardService.
   * @param {Router} router
   * @param {SnackbarComponent} snackbar
   * @memberof AuthguardService
   */
  constructor(private router: Router, private snackbar: SnackbarComponent) { }



  /**
   *  Checks if user is authenticated. Redirects if route is guarded and user is not logged in.
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @return {*}  {(boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>)}
   * @memberof AuthguardService
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve, reject) => {
      const auth = getAuth();

      onAuthStateChanged(auth, (user: User) => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(["/landing"]);
          this.snackbar.openSnackBar("Sie sind nicht eingeloggt!", "red-snackbar")
          resolve(false);
        }
      });
    });
  }
}
