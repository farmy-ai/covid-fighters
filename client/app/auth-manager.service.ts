import { Injectable } from '@angular/core';
import { RestService } from './REST.service';
import { tap, mapTo, catchError } from 'rxjs/operators';
import { of, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly PLAYER_ID = 'PLAYER_ID';
  private loggedUser: string;

  constructor(private http: RestService) { }

  login(email: string, password: string) {
    return this.http.login(email, password).pipe(
      tap(result => this.doLoginUser(email, result)),
      mapTo({ success: true, message: '' }),
      catchError(error => {
        console.log(error.error);
        if (error.status === 400) {
          return of({ success: false, message: 'Mail or password incorrect' });
        } else if (error.status === 403) {
          this.http.confirmEmail(email).toPromise().then(v => console.log(v));

          return of({ success: false, message: 'Please check your inbox for a confirmation email' });
        }
        return of({ success: false, message: 'UNKNOWN ERROR !' });
      }));
  }
  signUpUser(user) {
    return this.http.register(user).pipe(
      mapTo({ success: true, message: 'Confirmation Email Sent </br> Please check your email and confirm your email address.' }),
      catchError(error => {
        console.log(error.error);
        return of({ success: false, message: Object.values(error.error)[0][0] });
      }));
  }
  async logout() {

    this.doLogoutUser();
    return true;

  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return Observable.throw("not Implemented");
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(email: string, result: any) {
    this.loggedUser = email;
    this.storeTokens(result.access, 'result.refresh');
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
    console.log('[new JWT]' + jwt);
  }

  private storeTokens(jwt, refreshToken) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  private storePlayerID(id) {
    localStorage.setItem(this.PLAYER_ID, id);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    // Player ID is fix no need to remove it
    //localStorage.removeItem(this.PLAYER_ID);
  }
}
