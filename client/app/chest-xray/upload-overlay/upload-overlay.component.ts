import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from 'client/app/REST.service';

@Component({
  selector: 'app-upload-overlay',
  templateUrl: './upload-overlay.component.html',
  styleUrls: ['./upload-overlay.component.scss']
})
export class UploadComponent implements OnInit {

  uploadForm: FormGroup;

  tags = '';
  files = [];
  sending = false;
  constructor(private _formBuilder: FormBuilder, private http: RestService) { }

  ngOnInit() {
    this.uploadForm = this._formBuilder.group({
      data_type: ['x-ray', [Validators.required]],
      disease_type: ['covid', [Validators.required]],
      affiliation: ['', [Validators.required]],
      description: [''],
    });
  }

  add(event) {

    console.log(event.target.files);

    this.files = [...this.files, ...event.target.files];

  }
  Upload() {
    const data = { ...this.uploadForm.value, files: this.files, tags: ['test', 'ilies', 'covid'] }
    console.log(data);

    this.http.addData(data).subscribe(v => console.log(v));
    this.sending = true;
  }

}
