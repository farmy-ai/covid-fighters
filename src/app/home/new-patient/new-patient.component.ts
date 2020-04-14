import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DATA } from 'src/assets/CONST-DATA';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {

  wilayaList = DATA.WilayaList;
  pays = DATA.Pays;

  detected = 'oui';

  isLinear = false;
  InformationGeneral: FormGroup;
  Identification: FormGroup;
  ClinicalInformation: FormGroup;
  Symptoms: FormGroup;
  ClinicalExam: FormGroup;
  Conditions: FormGroup;
  ClinicalEvolution: FormGroup;
  Mobility: FormGroup;

  loga(v) {
    console.log(v);

  }

  constructor(private _formBuilder: FormBuilder) {


  }

  ngOnInit() {
    this.InformationGeneral = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.Identification = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.ClinicalInformation = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.Symptoms = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.ClinicalExam = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.Conditions = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.ClinicalEvolution = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.Mobility = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
