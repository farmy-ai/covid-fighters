import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthManagerService } from 'client/app/auth-manager.service';
import { MatDialog } from '@angular/material';
import { overlayViewComponent } from '../overlay-view/overlay-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private router:Router,private _formBuilder: FormBuilder, private auth: AuthManagerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      affiliation: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],

    });
  }
  async register() {

    let result = await this.auth.signUpUser(this.registerForm.value).toPromise();

    this.router.navigate(['login']);
  }
  waiting() {
    const dialog = this.dialog.open(overlayViewComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: {
        src: 'waiting',
      }
    });
    return dialog;
  }
  success(msg) {
    const dialog = this.dialog.open(overlayViewComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: {
        src: '/assets/svg/send.svg',
        description: msg,
        primary: { icon: 'open_in_browser', text: ' Login' },
        secondary: { icon: 'close', text: ' Cancel' },
      }
    });
    return dialog;
  }
  fail(message) {
    const dialog = this.dialog.open(overlayViewComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: {
        src: '/assets/svg/cancel.svg',
        description: message,
        primary: { icon: 'refresh', text: ' Try again' },
        secondary: { icon: 'close', text: ' Cancel' },
      }
    });
    return dialog;
  }

}
