import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../interfaces/common.interface';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store';
import {
  LogOutAction,
  AuthorizedUpdateTokenAction,
  AuthorizedSaveAdminAction,
  LogOutAsUserAction,
  AuthorizedUpdateUserAction
} from '@app/store';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static locales = { ru: 'ru-RU', en: 'en-US' };

  public changingUser = new EventEmitter();

  get lang(): string {
    return SessionService.getLang();
  }

  set lang(value: string) {
    if (value) {
      localStorage.setItem('lang', value);
    }
  }

  get locale(): string {
    return SessionService.getLocale();
  }

  private _user: User;

  get isAdmin(): boolean {
    return this.user ? this.user.isAdmin : false;
  }


  private _transaction: any;
  get transaction(): any {
    return this._transaction ? this._transaction : JSON.parse(localStorage.getItem('transaction'));
  }

  set transaction(value: any) {
    localStorage.setItem('transaction', JSON.stringify(value));
    this._transaction = value;
  }

  get openedAdmin() {
    return !!localStorage.getItem('savedAdmin');
  }

  get user(): User {
    if (!this._user) {
      const userKey = localStorage.getItem('user');
      if (userKey) {
        this._user = JSON.parse(userKey);
      }
    }
    return this._user;
  }

  set user(value: User) {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
      this.changingUser.emit(value);
    }
    this._user = value;
  }

  static getLang(): string {
    let lang = localStorage.getItem('lang');
    if (!lang) {
      lang = 'ru';
    }
    return lang;
  }

  static getLocale() {
    return SessionService.locales[SessionService.getLang()] ? SessionService.locales[SessionService.getLang()] : SessionService.getLang();
  }

  constructor(private router: Router,  private store: Store<fromStore.State>) {}

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.reloadAdmin();
    this.store.dispatch(new LogOutAction());
    this.router.navigateByUrl('/');
  }


  saveAdmin() {
    const token = localStorage.getItem('token');
    const _user = { ...this.user };
    _user['accessToken'] = token;
    this.store.dispatch(new AuthorizedSaveAdminAction(_user));
    localStorage.setItem('savedAdmin', JSON.stringify(_user));
  }

  reloadAdmin() {
    this.user = JSON.parse(localStorage.getItem('savedAdmin'));
    if (this.user) {
      this.store.dispatch(new AuthorizedUpdateTokenAction(this.user.accessToken));
      this.store.dispatch(new LogOutAsUserAction(this.user));
      localStorage.removeItem('savedAdmin');
    } else {
      const lang = localStorage.getItem('lang');
      this.store.dispatch(new LogOutAction());
      localStorage.clear();
      localStorage.setItem('lang', lang);
    }
    this.changingUser.emit(this.user);
  }

  openAsUser(user: User) {
    this.saveAdmin();
    this.user = user;
    this.store.dispatch(new AuthorizedUpdateTokenAction(this.user.accessToken));
    this.store.dispatch(new AuthorizedUpdateUserAction(this.user));
    this.router.navigateByUrl('/');
  }
}
