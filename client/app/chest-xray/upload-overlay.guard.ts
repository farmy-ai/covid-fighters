import { Injectable } from '@angular/core';
import { AuthManagerService } from '../auth-manager.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UploadOverlayGuard implements CanActivate {

  constructor(private auth: AuthManagerService, private router: Router) {

  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.auth.isLoggedIn()) return true;

    this.router.navigate(['register']);
    return false;
  }

}
