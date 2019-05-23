import {Injectable} from '@angular/core';
import {User} from '../interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

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
  private static locales = {ru: 'ru-RU', en: 'en-US'};
  private _token: string;
  private _user: User;
  private _userToEdit: any;

  get isAdmin(): boolean {
    return (this.user) ? this.user.isAdmin : false;
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

  get userToEdit(): any {
    return (this._userToEdit) ? this._userToEdit : JSON.parse(localStorage.getItem('userToEdit'));
  }

  set userToEdit(value: any) {
    localStorage.setItem('userToEdit', JSON.stringify(value));
    this._userToEdit = value;
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
    }
    this._user = value;
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  static getLang(): string {
    let lang = localStorage.getItem('lang');
    if (!lang) {
      lang = 'ru';
    }
    return lang;
  }

  static getLocale() {
    return (SessionService.locales[SessionService.getLang()])
      ? SessionService.locales[SessionService.getLang()]
      : SessionService.getLang();
  }
}
