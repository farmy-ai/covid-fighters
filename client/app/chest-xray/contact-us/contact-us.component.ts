import { Component, OnInit } from '@angular/core';
import { overlayViewComponent } from '../overlay-view/overlay-view.component';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthManagerService } from 'client/app/auth-manager.service';
import { MatDialog } from '@angular/material';
import { RestService } from 'client/app/REST.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private router: Router, private _formBuilder: FormBuilder, private http: RestService, private dialog: MatDialog) { }

  ngOnInit() {
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      number: [''],
      description: [''],

    });
  }
  async register() {

    const wait = this.waiting();

    let result = await this.http.contact(this.registerForm.value).toPromise().catch(v=> this.fail('Can\'t send info ,try again ! '));

    wait.close();
    if(result){
      this.success('We got your message and we ll contact you soon');
    }
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
        primary: { icon: 'open_in_browser', text: ' ok' },
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
