import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-problem-view',
  templateUrl: './problem-view.component.html',
  styleUrls: ['./problem-view.component.scss']
})
export class ProblemViewComponent implements OnInit {

  uiState = {
    index: 0,
    diseases: ['Healthy', 'Early Blight', 'Late Blight', 'Other']
  };
  formValue = {
    diag: '',
    description: '',
    treatement: ''
  };
  constructor(
    public dialogRef: MatDialogRef<ProblemViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    const length = data.expert_solutions.length - 1;
    console.log(data);

    if (data.expert_solutions[length]) {
      this.formValue.description = data.expert_solutions[length].description;
      this.formValue.diag = data.expert_solutions[length].diag;
      this.formValue.treatement = data.expert_solutions[length].treatement;
    }
  }

  onSave(): void {
    this.data.expert_solutions.push(this.formValue);
    this.dialogRef.close({ id: this.data.id, data: this.formValue });
    console.log('[ID ON SAVE]' + this.data.id);

  }
  change(next) {
    this.uiState.index = (this.uiState.index + next);
    if (this.uiState.index === this.data.images.length) {
      this.uiState.index = 0;
    }
    if (this.uiState.index === -1) {
      this.uiState.index = this.data.images.length - 1;
    }
  }
  ngOnInit() {
  }

}
