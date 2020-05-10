import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthManagerService } from '../auth-manager.service';
import { Router } from '@angular/router';
import { UploadComponent } from './upload-overlay/upload-overlay.component';
import { MatDialog } from '@angular/material';

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

  constructor(public dialog: MatDialog, private router: Router, private breakpointObserver: BreakpointObserver, public auth: AuthManagerService) { }

  openUpload() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['register']);
      return;
    }
    const dialogRef = this.dialog.open(UploadComponent, {
      width: '800px',
      height: '674px',
      panelClass: 'custom-dialog-container',
      data: event
    });
  }

  expert() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['register']);
      return;
    }
    this.router.navigate(['expert']);

  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
