import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-problem-card',
  templateUrl: './problem-card.component.html',
  styleUrls: ['./problem-card.component.scss']
})
export class ProblemCardComponent implements OnInit {

  @Input() set data(val: any) {
    this.metadata = val;
  }

  @Output() diagnose = new EventEmitter<any>();

  isArchive = false;
  metadata: any;

  constructor() { }

  ngOnInit() {
  }

  open() {
    console.log(this.metadata);

    this.diagnose.emit(this.metadata);
  }

}
