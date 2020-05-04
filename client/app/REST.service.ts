import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'client/environments/environment';
import { Observable } from 'rxjs';

const ROOT = environment.API_URL;
const signUpLink = `${ROOT}user`;
const signInLink = `${ROOT}login`;
const signOutLink = `${ROOT}auth/signout/`;
const UserLink = `${ROOT}user/`;
const AllData = `${ROOT}submissions?annotated=false`;
const addDataLink = `${ROOT}submission/`;
const ResendEmailLink = `${ROOT}auth/email/resend-confirm/`;
const demoLink = `${ROOT}predict`;
const statLink = `${ROOT}submissions/stat`;
const AddSolution = ` `;



@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }

  getLists() {
    return this.http.get(statLink);
  }

  demo(file, user) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', '');
    if (user) {
      formData.append('id_user', user.id_user);
    }
    return this.http.post(demoLink, formData);
  }

  register(user): Observable<any> {
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
  getImages() {
    console.log('[GET HISTORY QUERY]');

    return this.http.get(AllData).pipe(map((v: any) => {

      v.forEach(element => {
        element.createdAt = new Date(element.createdAt).getTime();
        element.updated_at = new Date(element.updated_at).getTime();
      });
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

  markAsSeen(id) {

    console.log('[MARKASSEEN QUERY]');

    return null;
  }

  addSolution(id, data) {

    console.log('[ADDANOMALY QUERY]');

    return this.http.post(AddSolution + id + '/solutions/', data).pipe(catchError(val => { console.log(val); return null; })).toPromise();
  }
}

