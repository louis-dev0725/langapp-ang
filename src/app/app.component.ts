import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'call-rocket';

  constructor(private translate: TranslateService) {
    // note: [SHR] try to find lang in localstorage
    this.translate.setDefaultLang('ru');
  }
}
