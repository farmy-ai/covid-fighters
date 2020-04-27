import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DATA } from '../../../assets/CONST-DATA';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {

  /*  */
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  placesCtrl = new FormControl();
  filteredPlaces: Observable<string[]>;
  Places: string[] = [];
  allPlaces: string[] = DATA.Pays;

  @ViewChild('placeInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  /*  */


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
  Laboratory: FormGroup;

  loga(v) {
    console.log(v);

  }

  constructor(private _formBuilder: FormBuilder) {
    this.filteredPlaces = this.placesCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allPlaces.slice()));
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
    this.Laboratory = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.Places.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.placesCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.Places.indexOf(fruit);

    if (index >= 0) {
      this.Places.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.Places.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.placesCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allPlaces.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
