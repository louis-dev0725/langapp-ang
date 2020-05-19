import { Component, NgZone, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import * as config from './../../../../../../../allParam.config';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss'],
})
export class PopupComponent implements OnInit {
  token = '';
  user: any = {};
  extension: any;
  siteAuthContent: boolean;
  siteUri = config.URIFront;

  constructor(private translate: TranslateService, private zone: NgZone) {}

  ngOnInit(): void {
    chrome.storage.local.get(['token', 'user'], (result) => {
      if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
        this.token = result.token;
        this.user = result.user;

        this.zone.run(() => {
          this.translate.setDefaultLang(this.user.homeLanguage.code);
          this.siteAuthContent = this.token !== '' && this.user !== '';
          console.log('this.siteAuthContent', this.siteAuthContent);
        });
      } else {
        this.zone.run(() => {
          this.translate.setDefaultLang('en');
          this.siteAuthContent = false;
          console.log('this.siteAuthContent', this.siteAuthContent);
        });
      }
    });
  }
}
