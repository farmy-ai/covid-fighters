import { Pipe, PipeTransform } from '@angular/core';
import * as momentjs from "moment";
@Pipe({
  name: 'timeSpan'
})
export class TimeSpanPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    
    return momentjs(value,'x').format('DD/MM/YYYY');
  }

}
