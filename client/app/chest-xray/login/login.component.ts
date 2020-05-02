import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { overlayViewComponent } from '../overlay-view/overlay-view.component';
import { AuthManagerService } from 'client/app/auth-manager.service';
import { RestService } from 'client/app/REST.service';
import { Router } from '@angular/router';

const delay = ms => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog,
    private auth: AuthManagerService, private http: RestService,
    private route: Router) { }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  async login() {
    let dialog = this.waiting();

    console.log('[User Login Data] ' + JSON.stringify(this.loginForm.value));

    const result = (await this.auth.login(this.loginForm.value.email, this.loginForm.value.password).toPromise()) as any;
    await delay(2000);
    dialog.close();

    if (result.success) {
      this.route.navigate(['home']);
      /*
      this.http.getUser().then((v: any) => {

        if (v.role !== 'user') {
          this.fail('Please enter with correct account');
        } else {
          console.log('redirecting..');
          this.route.navigate(['Home']);
          // location.href = '/webApp';
        }
      });
      */

    } else {
      dialog = this.fail(result.message);
      const res = await dialog.afterClosed().toPromise();
      if (res) {
        this.login();
      }
    }
  }
  fail(description) {
    const dialog = this.dialog.open(overlayViewComponent, {
      width: '360px',
      panelClass: 'custom-dialog-container',
      data: {
        src: '/assets/svg/cancel.svg',
        description,
        primary: { icon: 'refresh', text: ' try again' },
        secondary: { icon: 'close', text: ' cancel' },
      }
    });
    return dialog;
  }
  waiting() {
    const dialog = this.dialog.open(overlayViewComponent, {
      width: '360px',
      panelClass: 'custom-dialog-container',
      data: {
        src: 'waiting',
      }
    });
    return dialog;
  }

}
