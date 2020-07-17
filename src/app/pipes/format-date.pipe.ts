import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    const format = args[0] === 'en' ? 'yyyy-MM-dd' : 'dd.MM.yy';
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, `${format} HH:mm:ss`);
  }
}
