import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-overlay-view',
  templateUrl: './overlay-view.component.html',
  styleUrls: ['./overlay-view.component.scss']
})
export class overlayViewComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<overlayViewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      src: string,
      description: String,
      primary: { icon: String, text: String },
      secondary: { icon: String, text: String }
    }
  ) { }

  ngOnInit() {

  }
  close(res): void {
    this.dialogRef.close(res);
  }

}