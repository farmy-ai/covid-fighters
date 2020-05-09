import { Component, OnInit } from '@angular/core';
import { AuthManagerService } from 'client/app/auth-manager.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private auth:AuthManagerService) { }

  ngOnInit() {
  }

}
