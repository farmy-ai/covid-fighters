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

  other : any= {} ;
  pneumonia : any= {};
  covid : any= {};

  constructor(public dialog: MatDialog, private http: RestService) {
    /* form init */


  }

  async ngOnInit() {

    let result: Array<any> = (await this.http.getLists().toPromise()) as Array<any>;

    console.log(result);

    const otherList = result.filter((v => v._id.disease_type === 'other'));
    const covidList = result.filter((v => v._id.disease_type === 'covid'));
    const pneumoniaList = result.filter((v => v._id.disease_type === 'pneumonia'));

    this.other.count = otherList.length > 0 ? otherList.reduce((p, v) => { return { imagesCount: p.imagesCount + v.imagesCount } }).imagesCount : 0;
    this.covid.count = covidList.length > 0 ? covidList.reduce((p, v) => { return { imagesCount: p.imagesCount + v.imagesCount } }).imagesCount : 0;
    this.pneumonia.count = pneumoniaList.length > 0 ? pneumoniaList.reduce((p, v) => { return { imagesCount: p.imagesCount + v.imagesCount } }).imagesCount : 0;

    this.other.update = otherList.length > 0 ? otherList.reduce((p, v) => {
      const ps = new Date(p.createdAt).getTime();
      const vs = new Date(v.createdAt).getTime();
      return { lastUpdate: ps > vs ? ps : vs };
    }).lastUpdate : 0;
    this.covid.update = covidList.length > 0 ? covidList.reduce((p, v) => {
      const ps = new Date(p.createdAt).getTime();
      const vs = new Date(v.createdAt).getTime();
      return { lastUpdate: ps > vs ? ps : vs };
    }).lastUpdate : 0;
    this.pneumonia.update = pneumoniaList.length > 0 ? pneumoniaList.reduce((p, v) => {
      const ps = new Date(p.createdAt).getTime();
      const vs = new Date(v.createdAt).getTime();
      return { lastUpdate: ps > vs ? ps : vs };
    }).lastUpdate : 0;

    console.log(this.covid);
    console.log(this.other);
    console.log(this.pneumonia);

    this.other.update = this.other.update === 0 ? 'New' : new Date(this.other.update).toLocaleDateString();
    this.covid.update = this.covid.update === 0 ? 'New' : new Date(this.covid.update).toLocaleDateString();
    this.pneumonia.update = this.pneumonia.update === 0 ? 'New' : new Date(this.pneumonia.update).toLocaleDateString();



  }

  download(type) {
    window.open(environment.API_URL + 'submissions/download?disease_type=' + type, "_blank");
  }


}
