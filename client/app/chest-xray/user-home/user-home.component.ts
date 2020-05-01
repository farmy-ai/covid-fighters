import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, map, delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { UploadOverlayComponent } from '../upload-overlay/upload-overlay.component';

export const fade = trigger('fade', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate('400ms {{delay}}ms linear', style({ opacity: 1 }))
  ], { params: { delay: '30' } })
]);


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
  animations: [fade]

})
export class UserHomeComponent implements OnInit {

  end = 9;
  rest = 0;
  ascending = false;
  totalDataSize: any;
  loading = false;
  type = 'determinate';
  progress = 0;
  mobile = false;
  data = [];
  filterData = [];
  shownData = [];
  form: FormGroup;
  filterObj = new FormControl();
  searchObj = new FormControl('');
  filterList: Array<string>;

  constructor(public dialog: MatDialog) {
    /* form init */
    this.form = new FormGroup({
      search: this.searchObj,
      filter: this.filterObj
    });

  }

  ngOnInit() {
    this.searchObj.valueChanges
      .pipe(map(v => { this.loading = true; this.type = 'query'; return v; }))
      .pipe(debounceTime(1700)).subscribe(v => this.filter());
  }

  openUploadOverlay() {
    const dialog = this.dialog.open(UploadOverlayComponent, { width: '95vw', maxHeight: '98vh', panelClass: 'custom-dialog-container' });
  }

  filter() {
    if (this.filterObj.value == null) { this.filterObj.setValue(3); }
    if (this.searchObj.value === '') {
      this.filterData = this.data;
      this.loading = false;
      this.setLoad(9);
      return;
    }

    this.filterData = this.data.filter(item => {
      const val = Object.values<any>(item)[this.filterObj.value];
      if (this.filterObj.value === 0) {
        return val === this.searchObj.value;
      }
      return !!val && val.toLowerCase().search(new RegExp(this.searchObj.value.toLowerCase())) !== -1;
    });

    this.setLoad(9);
    this.loading = false;
  }
  sortBy(index: number) {
    this.filterData = this.filterData.slice().sort((a, b) => {

      a = Object.values(a)[index];
      b = Object.values(b)[index];

      if (a === b) {
        return 0;
      } else {
        if (this.ascending)
          return a > b ? 1 : -1;
        else
          return a < b ? 1 : -1;
      }
    });
    this.setLoad(9);
  }
  reverseSort(bool) {
    if (bool !== this.ascending) {
      this.ascending = !this.ascending;
      this.filterData = this.filterData.slice().reverse();
    }
  }
  setLoading() {
    /*
      total ====> 100%
      data =====> X
    */
    let result = (this.data.length * 100) / this.totalDataSize;
    result = ~~(result);
    this.progress = this.progress > result ? this.progress : result;
    console.log(this.progress);

  }
  setLoad(val) {
    this.end = val;
    if (this.filterData.length === 0)
      this.rest = 0;
    else
      this.rest = Math.max(this.filterData.length - this.end, 0);
  }
  tracbyfn(index, item) {
    return index + item.ID;
  }
}
