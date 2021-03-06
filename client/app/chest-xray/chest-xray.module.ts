import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChestXrayRoutingModule } from './chest-xray-routing.module';
import { ChestXrayComponent } from './chest-xray.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule,MatProgressBarModule, MatMenuModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, MatDividerModule, MatDatepickerModule, MatSelectModule, MatRadioModule, MatChipsModule, MatTooltipModule, MatBottomSheetModule } from '@angular/material/';
import { LayoutModule } from '@angular/cdk/layout';
import { UserHomeComponent } from './user-home/user-home.component';
import { LoadPipe } from './user-home/load.pipe';
import { LandingComponent } from './landing/landing.component';
import { UploadComponent } from './upload-overlay/upload-overlay.component';
import { SvgViewerModule } from './landing/svg-viewer/svg-viewer.component';
import { DemoPageComponent } from './demo-page/demo-page.component';
import { DisclamerComponent } from './demo-page/disclamer/disclamer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    ChestXrayComponent, LoginComponent, RegisterComponent,
    UserHomeComponent, LoadPipe, LandingComponent,
    UploadComponent, DemoPageComponent, DisclamerComponent, ContactUsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ChestXrayRoutingModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    SvgViewerModule,

  ],
  exports:[],
  entryComponents: [UploadComponent,DisclamerComponent]
})
export class ChestXrayModule { }
