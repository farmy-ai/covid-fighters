import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChestXrayComponent } from './chest-xray.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UploadComponent } from './upload-overlay/upload-overlay.component';
import { UploadOverlayGuard } from './upload-overlay.guard';
import { LandingComponent } from './landing/landing.component';
import { DemoPageComponent } from './demo-page/demo-page.component';

const routes: Routes = [
  {
    path: '', component: ChestXrayComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'home', component: UserHomeComponent },
      { path: 'upload', component: UploadComponent, canActivate: [UploadOverlayGuard] },
      { path: 'landing', component: LandingComponent },
      { path: 'demo', component: DemoPageComponent },
      { path: 'expert', loadChildren: () => import('./expert/expert.module').then(m => m.ExpertModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChestXrayRoutingModule { }
