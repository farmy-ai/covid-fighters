import { Injectable } from '@angular/core';
import { RestService } from './REST.service';
import { tap, mapTo, catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USER = 'USER';

  constructor(private http: RestService) { }

  setUser(v: any) {
    localStorage.setItem(this.USER, v);
  }
  user() {
    return localStorage.getItem(this.USER);
  }
  login(email: string, password: string) {
    return this.http.login(email, password).pipe(
      tap(result => this.doLoginUser(result)),
      map(result => { return { success: !!result, message: '' } }),
      catchError(error => {
        if (error.status === 403) {
          return of({ success: false, message: 'Mail or password incorrect' });
        }
        return of({ success: false, message: 'UNKNOWN ERROR !' });
      }));
  }

  signUpUser(user) {
    return this.http.register(user).pipe(
      mapTo({ success: true, message: 'Confirmation Email Sent </br> Please check your email and confirm your email address.' }),
      catchError(error => {
        console.log(error.message);
        return of(error);
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

  private doLoginUser(result: any) {
    this.storeTokens(result.token, 'result.refresh');
  }

  private doLogoutUser() {
    this.removeTokens();
  }

  private storeTokens(jwt, refreshToken) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    // Player ID is fix no need to remove it
    //localStorage.removeItem(this.PLAYER_ID);
  }
}
