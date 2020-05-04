import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ExpertComponent } from './expert.component';
import { ProblemCardComponent } from './problem-card/problem-card.component';
import { ProblemViewComponent } from './problem-view/problem-view.component';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
// tslint:disable-next-line: max-line-length
import { MatProgressBarModule, MatIconModule, MatMenuModule, MatButtonModule, MatRippleModule, MatSelectModule, MatButtonToggleModule, MatDatepickerModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { TimeSpanPipe } from './problem-card/time-span.pipe';
import { AiDiseasesPipe } from './problem-card/ai-diseases.pipe';
import { MySolutionPipe } from './problem-card/my-solution.pipe';
import { LoadPipe } from './load.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const materials =
  // tslint:disable-next-line: max-line-length
  [MatInputModule, MatFormFieldModule, MatSnackBarModule, MatProgressBarModule, MatIconModule, MatMenuModule, MatButtonModule, MatRippleModule, MatSelectModule, MatButtonToggleModule, MatDatepickerModule, MatCheckboxModule, MatDialogModule, MatMomentDateModule];


const routes: Routes = [
  { path: '', component: ExpertComponent },
  { path: ':profile', component: ExpertComponent }
];

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [LoadPipe, ExpertComponent, ProblemCardComponent, ProblemViewComponent, TimeSpanPipe, AiDiseasesPipe, MySolutionPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...materials,
    RouterModule.forChild(routes)
  ],
  entryComponents: [ProblemViewComponent]
})
export class ExpertModule { }
