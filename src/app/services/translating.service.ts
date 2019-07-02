import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SessionService } from "@app/services/session.service";

@Injectable({
  providedIn: 'root'
})
export class TranslatingService {
  private _translates;

  constructor(private http: HttpClient,
              private sessionService: SessionService) {
    this.loadFile(this.sessionService.lang).subscribe((res: any) => {
      this._translates = res;
    });
  }

  private loadFile(lang) {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }

  get translates() {
    return this._translates;
  }
}
