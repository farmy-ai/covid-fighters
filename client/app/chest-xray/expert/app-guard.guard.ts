import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthManagerService } from 'client/app/auth-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  /**
   *
   */
  constructor(private auth: AuthManagerService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(this.auth.isLoggedIn());
    console.log(next);
    console.log(state);

    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
