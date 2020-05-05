import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProblemViewComponent } from './problem-view/problem-view.component';
import { overlayViewComponent } from '../overlay-view/overlay-view.component';
import { AuthManagerService } from 'client/app/auth-manager.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { RestService } from 'client/app/REST.service';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-expert',
  templateUrl: './expert.component.html',
  styleUrls: ['./expert.component.scss']
})
export class ExpertComponent implements OnInit {

  // form Objects
  form: FormGroup;
  searchObj = new FormControl('');
  xRay = new FormControl(true);
  ctScan = new FormControl(false);
  // data
  uiState = {
    loading: false,
    end: 10,
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
      xRay: this.xRay,
      ctScan: this.ctScan
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

  public XrayCount() {
    return this.new.filter(v => v.data_type === 'x-ray').length;
  }
  public CtCount() {
    return this.new.filter(v => v.data_type === 'ct').length;
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
        match = (row.affiliation).toLowerCase().search(new RegExp(form.search.toLowerCase())) !== -1;
      }

      let x = row.data_type === 'x-ray';
      let c = row.data_type === 'ct';

      x = x === form.xRay;
      c = c === form.ctScan;

      return match && (x || c);
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

      if (!!result) {
        event.annotation = result;
        const tempResultLog = await this.http.addAnnotation(event._id, event).toPromise();

        const index = this.new.findIndex((v) => v._id === event._id);
        this.new.splice(index, 1);
        this.filter = [...this.new];
        this.setLoad(this.uiState.end + 1);
        this.confirmationDialog(index);

      }
    } catch (error) {
      console.log(error);
    }
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
      console.log('length' + this.filter[index]);
      console.log('index' + index);
      if (result) {
        if (this.filter.length > index) {
          this.openDialog(this.filter[index]);
        } else if (this.filter.length === index && index !== 0) {
          this.openDialog(this.filter[index - 1]);
        } else {
        }

      }
    });
  }
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight + 1;
    let max = document.documentElement.scrollHeight;

    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos >= max) {

      this.setLoad(this.uiState.end + 10);

    }
  }
}

