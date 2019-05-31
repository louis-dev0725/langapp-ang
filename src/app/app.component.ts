import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'call-rocket';

  constructor(private translate: TranslateService) {
    const langMap = {
      'ru-RU': 'ru',
      'en-US': 'en'
    };
    let langVal = localStorage.getItem('lang');
    if (!langVal) {
      langVal = navigator.language;
      if (langMap[langVal]) {
        langVal = langMap[langVal];
      }
      localStorage.setItem('lang', langVal);
    }
    this.translate.setDefaultLang(langVal);
  }

}
