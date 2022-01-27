import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { Observable } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { UserService } from './user.service';


/**
 *  Class to guard specified routes from users who do not have the role admin.
 *
 * @export
 * @class AdminguardService
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root'
})
export class AdminguardService implements CanActivate {


  /**
   * Creates an instance of AdminguardService.
   * @param {Router} router
   * @param {UserService} firestore
   * @param {SnackbarComponent} snackbar
   * @memberof AdminguardService
   */
  constructor(private router: Router, private firestore: UserService, private snackbar: SnackbarComponent) { }




  /**
   * Checks if user is authenticated. Redirects if route is guarded and user does not have the role admin.
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @return {*}  {(boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>)}
   * @memberof AdminguardService
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: User) => {
        if (user) {
          let u: DiversITUser = await this.firestore.getUserPerIDPromise(user.uid);
          if (u.role == 1) resolve(true);
          else { 
            this.router.navigate(["/app"]);
            this.snackbar.openSnackBar("Unauthorisierter Zugriff", "red-snackbar")
            resolve(false);
          }
        }
      });
    });
  }
}
