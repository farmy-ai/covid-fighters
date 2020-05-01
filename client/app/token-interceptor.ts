import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthManagerService } from './auth-manager.service';
import { Router } from '@angular/router';
import { environment } from 'client/environments/environment';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthManagerService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getJwtToken()) {
      request = this.addToken(request, this.authService.getJwtToken());
    } else if(environment.production) {
      request = request.clone({
        setHeaders: {
          'X-API-KEY': environment.API_KEY
        }
      });
    }

    return <any>next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {

        // this condition is for get refresh token request
        // 'Token is invalid or expired' is unique for getRefresh token
        // if this error occurs that mean we need to logOUT
        // without this line it will not throw error
        if (error.error.detail === 'Token is invalid or expired') {
          return throwError(error);
        }

        return this.handle401Error(request, next, error);
      } else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {

    let Configuration;
    if (environment.production) {
      Configuration = {
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': environment.API_KEY
        }
      };
    } else {
      Configuration = {
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      };

    }
    return request.clone(Configuration);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, error) {

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      console.log('getting refresh');
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        catchError((err) => {
          console.log('error getting token');

          this.authService.logout();
          this.router.navigate(['']);
          return throwError(err);
        }),
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access);
          console.log('[refresh result]' + token.access);

          return next.handle(this.addToken(request, token.access));
        }));
    } else {

      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(access => {
          console.log('[ACCESS]');
          console.log(access);

          return next.handle(this.addToken(request, access));
        }));
    }
  }
}
