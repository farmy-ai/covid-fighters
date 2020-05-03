import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mySolution'
})
export class MySolutionPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
