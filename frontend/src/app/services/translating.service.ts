import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '@app/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class TranslatingService {
  private _translates = {
    ru: '',
    en: ''
  };

  constructor(private http: HttpClient, private sessionService: SessionService) {
    this.loadFileAndSave('ru');
    this.loadFileAndSave('en');
  }

  private loadFileAndSave(lang) {
    return this.http.get(`./assets/i18n/${lang}.json`)
    .subscribe((res: any) => {
      this._translates[`${lang}`] = res;
    });
  }

  get translates() {
    return this._translates[this.sessionService.language];
  }
}
