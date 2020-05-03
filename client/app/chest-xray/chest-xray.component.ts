import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthManagerService } from '../auth-manager.service';

@Component({
  selector: 'app-chest-xray',
  templateUrl: './chest-xray.component.html',
  styleUrls: ['./chest-xray.component.scss']
})
export class ChestXrayComponent implements OnInit {

  logged = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,public auth:AuthManagerService) { }

  ngOnInit() {
  }

}
