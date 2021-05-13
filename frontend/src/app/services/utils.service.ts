import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SessionService } from '@app/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private sessionService: SessionService) {}

  public convertDate(date) {
    const format = this.sessionService.language === 'en' ? 'yyyy-MM-dd' : 'dd-MM-yy';
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, `${format} HH:mm:ss`);
  }

  public convertValue(value) {
    const lang = this.sessionService.language;
    let _value = parseFloat(value).toFixed(2);
    if (lang === 'ru') {
      _value.replace('.', ',');
    }
    return +_value || 0;
  }
}
