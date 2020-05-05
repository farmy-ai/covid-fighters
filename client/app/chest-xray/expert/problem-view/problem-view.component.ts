import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-problem-view',
  templateUrl: './problem-view.component.html',
  styleUrls: ['./problem-view.component.scss']
})
export class ProblemViewComponent implements OnInit {

  formValue = {
    disease_type: '',
    description: ''
  };
  constructor(
    public dialogRef: MatDialogRef<ProblemViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onSave(): void {
    this.dialogRef.close({ id: this.data._id, data: this.formValue });
  }

  ngOnInit() {
  }

}
