import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private langMap = {
     'ru': 'ru-RU',
     'en': 'en-US'
  };

  constructor() {
  }


  public convertDate(date) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }

}
