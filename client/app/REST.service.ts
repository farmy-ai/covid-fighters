import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'client/environments/environment';

const ROOT = environment.API_URL;
const signUpLink = `${ROOT}user`;
const signInLink = `${ROOT}login`;
const signOutLink = `${ROOT}auth/signout/`;
const UserLink = `${ROOT}user/`;
const AllData = `${ROOT}submission/`;
const addDataLink = `${ROOT}submission/`;
const ResendEmailLink = `${ROOT}auth/email/resend-confirm/`;

@Injectable({
  providedIn: 'root'
})
export class RestService {


  constructor(private http: HttpClient) {
  }

  register(user) {
    console.log(user);

    return this.http.post(signUpLink, user);
  }
  login(email, password) {
    console.log('[LOGIN QUERY]');

    return this.http.post(signInLink, { email, password }).pipe(map((res) => { console.log(res); return res; }));
  }
  confirmEmail(email) {
    console.log('[CONFIRMATION QUERY]');

    return this.http.post(ResendEmailLink, { email }).pipe(map((res) => { console.log(res); return res; }));
  }
  logOut(player_id: string) {
    console.log('[LOGOUT QUERY]');

    return this.http.post(signOutLink, { player_id }).toPromise();
  }
  getUser() {

    console.log('[GETUSER QUERY]');

    return this.http.get(UserLink).toPromise();
  }
  getAnomalies() {
    console.log('[GET HISTORY QUERY]');

    return this.http.get(AllData).pipe(map((v: any) => {
      console.log(v);

      return v;

    }));
  }
  addData(Data) {
    console.log('[ADD ANOMALY QUERY]');
    console.log(Data);

    const formData: FormData = new FormData();

    formData.append('files', Data.files);


    for (const key in Data) {
      if (key !== 'files') {
        formData.append(key, Data[key]);
      }
    }

    return this.http.post(addDataLink, Data, { reportProgress: true, observe: 'events' });
  }
}

