import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

const locales = {
  ru: {
    label: 'ru-RU',
    currency: 'RUB',
    mark: '₽'
  },
  en: {
    label: 'en-US',
    currency: 'USD',
    mark: '$'
  }
};
@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const lang = locales[args[0]];
    const _value = formatCurrency(value, lang.label, lang.mark, lang.currency, '1.0-2');
    return _value;
  }
}
