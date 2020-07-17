import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundTo'
})
export class RoundToPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const _value = parseInt(value).toFixed(args[0] || 0);
    return +_value;
  }
}
