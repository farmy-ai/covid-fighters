import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'load',
  pure: true
})
export class LoadPipe implements PipeTransform {

  transform(value: Array<any>, ...args: any[]): any {
    return _.take(value, args[0]);
  }

}
