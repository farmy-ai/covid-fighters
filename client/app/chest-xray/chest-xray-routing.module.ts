import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChestXrayComponent } from './chest-xray.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { LandingComponent } from './landing/landing.component';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '', component: ChestXrayComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'home', component: UserHomeComponent },
      { path: '', component: LandingComponent },
      { path: 'demo', component: DemoPageComponent },
      { path: 'contact', component: ContactUsComponent },
      { path: 'expert', loadChildren: () => import('./expert/expert.module').then(m => m.ExpertModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChestXrayRoutingModule { }
