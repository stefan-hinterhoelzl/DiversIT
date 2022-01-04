import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { Observable } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { UserService } from './user.service';

/**
 * Guardclass to protect a route from users who are mentors
 *
 * @export
 * @class MentorGuardService
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root'
})
export class MentorGuardService implements CanActivate {

  /**
   * Creates an instance of MentorGuardService.
   * @param {Router} router
   * @param {UserService} firestore
   * @memberof MentorGuardService
   */
  constructor(private router: Router, private firestore: UserService) { }



  /**
   * the actual guard method which is called by the router
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {*}  {(boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>)}
   * @memberof MentorGuardService
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: User) => {
        if (user) {
          let u: DiversITUser = await this.firestore.getUserPerIDPromise(user.uid);
          if (u.role !== 2) resolve(true);
          else { 
            this.router.navigate(["/profile/" + u.uid]);
            resolve(false);
          }
        }
      });
    });
  }
}
