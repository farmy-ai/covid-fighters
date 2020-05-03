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
const demoLink = `${ROOT}predict`;
const AllHistory =` `;
const AddSolution =` `;



@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }

  demo(file, user) {
    const formData = new FormData();
    formData.append('file', file);
    if (user) {
      formData.append('id_user', user.id);
    }
    return this.http.post(demoLink, formData);
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

    const formData = new FormData();

    for (const key in Data) {
      if (key !== 'files') {
        formData.append(key, Data[key]);
      }
    }

    //formData.append('files', Data.files);
    for (let img of Data.files) {
      formData.append('files', img);
    }

    return this.http.post(addDataLink, formData, { reportProgress: true, observe: 'events' });
  }


  /////////////////////////
  // expert Rest service //
  /////////////////////////

  getHistory() {
    console.log('[GET ANOMALIES QUERY]');

    return this.http.get(AllHistory).pipe(map((v: any) => {
      console.log(v);

      v.forEach(element => {
        element.created = new Date(element.created).getTime();
        element.updated = new Date(element.updated).getTime();
      });
      return v;

    }));

  }

  markAsSeen(id) {

    console.log('[MARKASSEEN QUERY]');

    return null;
  }

  addSolution(id, data) {

    console.log('[ADDANOMALY QUERY]');

    return this.http.post(AddSolution + id + '/solutions/', data).pipe(catchError(val => { console.log(val); return null; })).toPromise();
  }
}

