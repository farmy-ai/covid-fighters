import { Component, OnInit } from '@angular/core';
import { RestService } from 'client/app/REST.service';
import { AuthManagerService } from 'client/app/auth-manager.service';

@Component({
  selector: 'app-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnInit {

  state = 'before';

  constructor(private http: RestService, private auth: AuthManagerService) { }

  ngOnInit() { }

  upload(event, img) {

    // FileReader support
    if (FileReader && event.target.files && event.target.files[0]) {
      var fr = new FileReader();
      fr.onload = function () {
        img.src = fr.result;
      }
      fr.readAsDataURL(event.target.files[0]);
    }

    this.http.demo(event.target.files[0], this.auth.user()).subscribe(v => {
      console.log(v);
    });
  }

}















