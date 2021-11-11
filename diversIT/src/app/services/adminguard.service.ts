import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import { Observable } from 'rxjs';
import { DiversITUser } from '../models/users.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AdminguardService implements CanActivate {

  constructor(private router: Router, private firestore: FirestoreService) { }



  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: User) => {
        if (user) {
          let u: DiversITUser = await this.firestore.getUserPerIDPromise(user.uid);
          if (u.role == 1) resolve(true);
          else { 
            this.router.navigate(["/unauthorized"]);
            resolve(false);
          }
        }
      });
    });
  }
}
