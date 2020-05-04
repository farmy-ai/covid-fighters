import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, map, delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { UploadComponent } from '../upload-overlay/upload-overlay.component';
import { RestService } from 'client/app/REST.service';
import { environment } from 'client/environments/environment';

export const fade = trigger('fade', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate('400ms {{delay}}ms linear', style({ opacity: 1 }))
  ], { params: { delay: '30' } })
]);


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
  animations: [fade]

})
export class UserHomeComponent implements OnInit {

  other: Number;
  pneumonia: Number;
  covid: Number;

  constructor(public dialog: MatDialog, private http: RestService) {
    /* form init */


  }

  async ngOnInit() {

    let result: Array<any> = (await this.http.getLists().toPromise()) as Array<any>;

    this.other = result.filter((v => v._id.disease_type === 'other')).reduce((p, v) => { return { imagesCount: p.imagesCount + v.imagesCount } }).imagesCount;
    this.covid = result.filter((v => v._id.disease_type === 'covid')).reduce((p, v) => { return { imagesCount: p.imagesCount + v.imagesCount } }).imagesCount;
    this.pneumonia = result.filter((v => v._id.disease_type === 'pneumonia')).reduce((p, v) => { return { imagesCount: p.imagesCount + v.imagesCount } }).imagesCount;

  }

  download(type) {
    window.open(environment.API_URL + 'submissions/download?disease_type=' + type, "_blank");
  }


}
