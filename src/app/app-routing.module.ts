import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewPatientComponent } from './home/new-patient/new-patient.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: 'add', component: NewPatientComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
