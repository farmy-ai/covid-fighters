import { Component, OnInit } from '@angular/core';
import { RestService } from 'client/app/REST.service';
import { AuthManagerService } from 'client/app/auth-manager.service';
import { MatBottomSheet } from '@angular/material';
import { DisclamerComponent } from './disclamer/disclamer.component';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {

  state = 'before';
  imageSource = '';
  result: any = [];
  constructor(private http: RestService, private auth: AuthManagerService,private _bottomSheet: MatBottomSheet) { }

  ngOnInit() { }

  round(v) {
    console.log(v * 100);

    return Math.floor(v * 100);
  }
  async upload(event) {

    let accepted = await this._bottomSheet.open(DisclamerComponent).afterDismissed().toPromise();

    if (accepted) {
      this.state = 'loading';
      // FileReader support
      if (FileReader && event.target.files && event.target.files[0]) {
        var fr = new FileReader();

        let change = (src) => {
          this.imageSource = src;
        }
        fr.onload = function (e) {
          change(e.target['result']);
        }
        fr.readAsDataURL(event.target.files[0]);
      }

      this.http.demo(event.target.files[0], this.auth.user()).toPromise().then(v => {
        console.log(v);
        this.state = 'result';
        this.result = v as any;
      }).catch(e => { this.state = 'error'; console.log(e); return e });
    }

  }

}

















