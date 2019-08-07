import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { User } from '../interfaces/common.interface';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  public changingUser = new EventEmitter();

  get lang(): string {
    return SessionService.getLang();
  }

  set lang(value: string) {
    if (value) {
      this._lang = value;
      localStorage.setItem('lang', value);
    }
  }

  get locale(): string {
    return SessionService.getLocale();
  }

  private _lang: string;
  private static locales = { ru: 'ru-RU', en: 'en-US' };
  private _token: string;
  private _user: User;
  private _userToEdit: any;

  get isAdmin(): boolean {
    return this.user ? this.user.isAdmin : false;
  }

  get isLoggedIn(): boolean {
    const token = this.token;
    return !!token;
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  set token(value: string) {
    localStorage.setItem('token', value);
    this._token = value;
  }

  private _tempUser: any;
  get tempUser(): any {
    return this._tempUser ? this._tempUser : JSON.parse(localStorage.getItem('tempUser'));
  }

  set tempUser(value: any) {
    localStorage.setItem('tempUser', JSON.stringify(value));
    this._tempUser = value;
  }

  private _transaction: any;
  get transaction(): any {
    return this._transaction ? this._transaction : JSON.parse(localStorage.getItem('transaction'));
  }

  set transaction(value: any) {
    localStorage.setItem('transaction', JSON.stringify(value));
    this._transaction = value;
  }

  get userToEdit(): any {
    return this._userToEdit ? this._userToEdit : JSON.parse(localStorage.getItem('userToEdit'));
  }

  set userToEdit(value: any) {
    localStorage.setItem('userToEdit', JSON.stringify(value));
    this._userToEdit = value;
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

  constructor(private router: Router) {
    this.changingUser.pipe(untilDestroyed(this)).subscribe((user: any) => {
      localStorage.setItem('user', JSON.stringify(user));
    });
  }

  ngOnDestroy(): void {}

  logout() {
    this.token = '';
    this.user = undefined;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.reloadAdmin();
    this.router.navigateByUrl('/');
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

  saveAdmin() {
    localStorage.setItem('savedAdmin', JSON.stringify(this.user));
  }

  reloadAdmin() {
    this.user = JSON.parse(localStorage.getItem('savedAdmin'));
    if (this.user) {
      this.token = this.user.accessToken;
      localStorage.removeItem('savedAdmin');
    }
    this.changingUser.emit(this.user);
  }

  openAsUser(user: User) {
    this.saveAdmin();
    this.user = user;

    this.token = user.accessToken;
    this.router.navigateByUrl('/');
  }
}
