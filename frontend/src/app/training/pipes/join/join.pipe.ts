import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: any[], separator: string = ',', key: string = 'value'): string {
    if (value && value.length > 0) {
      return value
        .filter((item) => item[key])
        .map((item) => item[key])
        .join(separator);
    }
  }
}
