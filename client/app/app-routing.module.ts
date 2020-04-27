import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewPatientComponent } from './home/new-patient/new-patient.component';


const routes: Routes = [
  {
    path: 'quiz helper', component: HomeComponent, children: [
      { path: 'add', component: NewPatientComponent }
    ]
  },
  { path: '', loadChildren: () => import('./chest-xray/chest-xray.module').then(m => m.ChestXrayModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
