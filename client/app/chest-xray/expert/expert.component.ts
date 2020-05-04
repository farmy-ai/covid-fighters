import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProblemViewComponent } from './problem-view/problem-view.component';
import { overlayViewComponent } from '../overlay-view/overlay-view.component';
import { AuthManagerService } from 'client/app/auth-manager.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { RestService } from 'client/app/REST.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expert',
  templateUrl: './expert.component.html',
  styleUrls: ['./expert.component.scss']
})
export class ExpertComponent implements OnInit {

  // form Objects
  form: FormGroup;
  searchObj = new FormControl('');
  FromObj = new FormControl();
  ToObj = new FormControl();
  // data
  uiState = {
    loading: false,
    end: 10,
    count: 0,
    rest: 0,
  };
  // data
  new: Array<any> = [];
  filter: Array<any>;

  // Filters Data

  constructor(private snackBar: MatSnackBar, public router: Router, public dialog: MatDialog,
    private http: RestService, private auth: AuthManagerService) {

  }

  ngOnInit() {

    /* form init */
    this.form = new FormGroup({
      search: this.searchObj,
      xRay: this.FromObj,
      ctScan: this.ToObj
    });
    // filters init
    this.form.valueChanges.pipe(debounceTime(1700)).subscribe(form => {
      this.filterFunc(form);
    });
    // get new data first
    this.http.getImages().subscribe(v => {
      this.new = v.sort((a, b) => a.created - b.created) as any;
      this.filter = this.new;
      console.log(this.new);
    });
  }
  private filterFunc(form: any) {
    try {
      console.log('[FORM]' + form);

    } catch (error) { }

    let data = [];
    data = this.new.slice();

    this.filter = data.filter(row => {
      let match = true;
      if (!!form.search && form.search !== '') {
        match = (row.farmer.first_name + ' ' + row.farmer.last_name).toLowerCase().search(new RegExp(form.search.toLowerCase())) !== -1;
      }
      let from = true;
      if (match && !!form.from && moment.isMoment(form.from)) {
        from = form.from.valueOf() <= row.created;
      }
      let to = true;
      if (from && !!form.to && moment.isMoment(form.to)) {
        to = form.to.valueOf() >= row.created;
      }
      return match && from && to;
    });
    console.log(this.filter);
  }

  setLoad(val) {
    this.uiState.end = val;
    if (this.filter.length === 0) {
      this.uiState.rest = 0;
    } else {
      this.uiState.rest = Math.max(this.filter.length - this.uiState.end, 0);
    }
  }
  tracbyfn(index, item) {
    return item.id;
  }

  async openDialog(event: any) {

    const dialogRef = this.dialog.open(ProblemViewComponent, {
      minWidth: '1110px',
      maxWidth: '1110px',
      height: '674px',
      panelClass: 'custom-dialog-container',
      data: event
    });
    try {
      const result = await dialogRef.afterClosed().toPromise();
      console.log(result);


      if (!!result) {

        const tempResultLog = await this.http.addSolution(result.id, result.data);
        console.log(tempResultLog);

        const index = this.new.findIndex((v) => v.id === result.id);

        console.log(this.new[index]);

        this.new[index].expert_solutions[0] = result.data;

        this.new.splice(index, 1);
        this.filter = [...this.new];
        this.setLoad(this.uiState.end + 1);
        this.confirmationDialog(index);

      }
    } catch (error) {
      console.log(error);

    }
  }
  openEditProfile(event: any): void {

  }
  modificationDialogue() {
    const confirmationDiag = this.dialog.open(overlayViewComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: {
        src: '/assets/svg/send.svg',
        description: 'Solution modified successfully',
        primary: { icon: 'open_in_browser', text: ' Ok' },
        secondary: { icon: 'close', text: ' Close' },
      }
    });
  }
  confirmationDialog(index) {
    const confirmationDiag = this.dialog.open(overlayViewComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      data: {
        src: '/assets/svg/send.svg',
        description: 'Solution sent successfully',
        primary: { icon: 'open_in_browser', text: ' Next' },
        secondary: { icon: 'close', text: ' Close' },
      }
    });
    confirmationDiag.afterClosed().subscribe(result => {
      console.log('length' + this.new.length);
      console.log('index' + index);
      if (result) {
        if (this.new.length > index) {
          this.openDialog(this.new[index]);
        } else if (this.new.length === index && index !== 0) {
          this.openDialog(this.new[index - 1]);
        } else {
        }

      }
    });
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

