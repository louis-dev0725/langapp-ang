import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: 'popup.component.html',
  styleUrls: ['popup.component.scss'],
})
export class PopupComponent implements OnInit {
  token: string;
  user: any = {};
  extension: any;
  siteAuth = false;

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
        console.log(result);
      }
    });

    chrome.storage.sync.get(['user'], (result) => {
      if (result.hasOwnProperty('user')) {
        this.user = JSON.parse(result.user);
        console.log(result);
      }
    });
  }

  siteAction(action, data: any = {}) {
    if (action === 'auth') {
      this.user = JSON.parse(data.user);
      this.token = data.token;
      this.siteAuth = true;

      chrome.storage.sync.set({ token: data.token }, () => {
        console.log('Set token');
      });
      chrome.storage.sync.set({ user: data.user }, () => {
        console.log('Set user');
      });
    }
    if (action === 'logout') {
      this.siteAuth = false;
      chrome.storage.sync.remove(['token', 'user']);
    }
  }

  // Принимаем данные которые нам послал contentPage.js
  // chrome.extension.onMessage.addListener((request, sender, respond) => {});

  // Послыаем данные в contentPage.js
  // chrome.tabs.sendMessage();
}
