import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      first_name: string,
      last_name: string,
      address: string,
      phone: string,
      email: string,
      role: string,
      domain: string,
      expertise: [string],
    }
  ) {
  }
  close(res): void {
    this.dialogRef.close(res);
  }
  ngOnInit() {
  }
  delete(index: number) {
    this.data.expertise.splice(index, 1);
  }
  trackByFn(index, x) {
    return index;
  }
}
