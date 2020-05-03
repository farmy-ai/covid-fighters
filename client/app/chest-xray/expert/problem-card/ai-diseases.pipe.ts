import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aiDiseases'
})
export class AiDiseasesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let diagnoses = ' ';
    for (let index = 0; index < value.length; index++) {

      diagnoses += value[index] + ' ';
      if (index !== value.length - 1) {
        diagnoses += ' | ';
      }

    }
    return value;
  }

}
