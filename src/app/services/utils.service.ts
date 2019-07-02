import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { toNumbers } from "@angular/compiler-cli/src/diagnostics/typescript_version";
import { SessionService } from "@app/services/session.service";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private langMap = {
     'ru': 'ru-RU',
     'en': 'en-US'
  };

  constructor(private sessionService: SessionService) {
  }

  public convertDate(date) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }

  public convertValue(value) {
    console.log(value);
    const lang = this.sessionService.lang;
    let _value = parseFloat(value).toFixed(2);
    if(lang == 'ru') {
      _value.replace('.', ',');
    }
    console.log(+_value);
    return +_value || 0;
  }
}
