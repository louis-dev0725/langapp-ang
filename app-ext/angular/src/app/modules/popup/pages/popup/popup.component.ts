import { Component, NgZone, OnInit } from '@angular/core';

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

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    chrome.storage.local.get(['token', 'user'], (result) => {
      if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
        this.token = result.token;
        this.user = JSON.parse(result.user);

        this.zone.run(() => {
          this.siteAuthContent = this.token !== '' && this.user !== '';
          console.log('this.siteAuthContent', this.siteAuthContent);
        });
      } else {
        this.zone.run(() => {
          this.siteAuthContent = false;
          console.log('this.siteAuthContent', this.siteAuthContent);
        });
      }
    });
  }
}
