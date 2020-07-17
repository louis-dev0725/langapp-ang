import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumbers'
})
export class FormatNumbersPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const lang = args[0];
    const _value = parseFloat(value).toFixed(2);
    if (lang === 'ru') {
      // _value = _value.toString().replace(".", ",");
    }
    return +_value;
  }
}
