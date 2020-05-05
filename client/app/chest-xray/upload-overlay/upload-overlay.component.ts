import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'client/app/REST.service';
import { HttpEventType } from "@angular/common/http";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-upload-overlay',
  templateUrl: './upload-overlay.component.html',
  styleUrls: ['./upload-overlay.component.scss']
})
export class UploadComponent implements OnInit {

  uploadForm: FormGroup;

  tags = '';
  files = [];
  public state = 'before';
  progress = '0%';
  constructor(private _formBuilder: FormBuilder, private http: RestService,private router:Router
    ,public dialogRef: MatDialogRef<UploadComponent>,) { }

  ngOnInit() {
    this.uploadForm = this._formBuilder.group({
      data_type: ['x-ray', [Validators.required]],
      disease_type: ['covid', [Validators.required]],
      affiliation: ['', [Validators.required]],
      description: [''],
    });
  }

  add(event) {

    if (event.target.files.length > 0) {
      this.files = event.target.files;
    }

  }
  Upload() {
    const data = { ...this.uploadForm.value, files: this.files, tags: ['test', 'ilies', 'covid'] }
    console.log(data);
    this.state = 'sending';
    this.http.addData(data).pipe(catchError(e => { this.state = 'error'; console.log(e); return of(e); })).subscribe(v => {
      if (v.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(v.loaded / v.total * 100) + '%';
      } else if(v.type === HttpEventType.Response) {
        this.state = 'success';
      }
    });
  }
  close(){
    this.dialogRef.close();
    this.router.navigate(['home']);
  }

}
