import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-overlay',
  templateUrl: './upload-overlay.component.html',
  styleUrls: ['./upload-overlay.component.scss']
})
export class UploadOverlayComponent implements OnInit {

  uploadForm: FormGroup;

  tags = '';
  files = [];
  sending = false;
  constructor(public dialogRef: MatDialogRef<UploadOverlayComponent>, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.uploadForm = this._formBuilder.group({
      data_type: ['x-ray', [Validators.required]],
      disease_type: ['covid', [Validators.required]],
      description: ['', [Validators.required]],
      affiliation: ['', [Validators.required]],
    });
  }

  add(event) {

    console.log(event.target.files);

    this.files = [...this.files, ...event.target.files];

  }
  Upload() {
    this.sending = true;
  }

  close(res): void {
    this.dialogRef.close(res);
  }


}
