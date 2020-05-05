import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  templateUrl: './disclamer.component.html',
  styleUrls: ['./disclamer.component.scss']
})
export class DisclamerComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<DisclamerComponent>) { }

  ngOnInit() {
  }

  accept(result){
    this.bottomSheetRef.dismiss(result);
  }

}
