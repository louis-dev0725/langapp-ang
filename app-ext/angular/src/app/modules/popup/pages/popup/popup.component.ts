import { Component, OnInit } from '@angular/core';

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

  constructor() {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'siteAuth') {
        this.siteAction('auth', message.data);
      }
      if (message.type === 'siteLogout') {
        this.siteAction('logout');
      }
    });
  }

  ngOnInit(): void {
    chrome.storage.sync.get(['token'], (result) => {
      if (result.hasOwnProperty('token')) {
        this.token = result.token;
      }
    });

    chrome.storage.sync.get(['user'], (result) => {
      if (result.hasOwnProperty('user')) {
        this.user = JSON.parse(result.user);
      }
    });

    this.siteAuthContent = this.token !== '' && this.user !== '';
  }

  siteAction(action, data: any = {}) {
    if (action === 'auth') {
      this.user = JSON.parse(data.user);
      this.token = data.token;
      this.siteAuthContent = true;

      chrome.storage.sync.set({ token: data.token }, () => {
        console.log('Set token');
      });
      chrome.storage.sync.set({ user: data.user }, () => {
        console.log('Set user');
      });
    }

    if (action === 'logout') {
      this.siteAuthContent = false;
      chrome.storage.sync.remove(['token', 'user', 'settingExtension']);
    }
  }
}
