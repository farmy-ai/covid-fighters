import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-problem-card',
  templateUrl: './problem-card.component.html',
  styleUrls: ['./problem-card.component.scss']
})
export class ProblemCardComponent implements OnInit {

  @Input() set grid(val: boolean) {
    this.isGrid = val;
  }
  @Input() set aiDiagnose(val: boolean) {
    this.isArchive = val;
  }
  @Input() set data(val: any) {
    this.metadata = val;
  }

  @Output() diagnose = new EventEmitter<any>();

  isArchive = false;
  isGrid: Boolean;
  metadata: any;

  constructor() { }

  ngOnInit() {
  }

  open() {
    this.diagnose.emit(this.metadata);
  }

}
