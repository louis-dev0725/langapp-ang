import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SessionService } from "@app/services/session.service";
import { forkJoin, Observable, of } from "rxjs";
import { subscribeTo } from "rxjs/internal-compatibility";

@Injectable({
  providedIn: 'root'
})
export class TranslatingService {
  private _translates = {
    'ru': '',
    'en': ''
  };

  constructor(private http: HttpClient,
              private sessionService: SessionService) {
    this.loadFile('ru').subscribe((res: any) => {
      this._translates.ru = res;
    });
    this.loadFile('en').subscribe((res: any) => {
      this._translates.en = res;
    });
  }

  private loadFile(lang) {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }

  get translates() {
    return this._translates[this.sessionService.lang];
  }
}
