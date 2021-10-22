import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '@app/interfaces/common.interface';
import { Router } from '@angular/router';
import * as fromStore from '@app/store/index';
import {
  LogOutAction, AuthorizedUpdateTokenAction, AuthorizedSaveAdminAction, LogOutAsUserAction,
  AuthorizedUpdateUserAction
} from '@app/store/index';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '@app/event.service';
import { CookieService } from 'ngx-cookie';
import { ReplaySubject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private defaultLanguage = 'en';
  private _language: string;

  public user$ = new ReplaySubject<User>(1);
  private _user: User;

  constructor(private router: Router,
    private store: Store<fromStore.State>,
    private translateService: TranslateService,
    private eventService: EventService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.init();
  }

  init() {
    this.user$.subscribe((user) => {
      if (!this._user || this._user.language != user.language || this._language != user.language) {
        this._changeLanguage(user.language);
      }

      this._user = user;
      localStorage.setItem('user', JSON.stringify(user));
    });

    if (!this._user) {
      let userFromLS = localStorage.getItem('user');
      if (userFromLS) {
        let user = JSON.parse(userFromLS);
        if (user) {
          this.user$.next(user);
        }
      }
    }

    if (!this._language) {
      let lang = this.cookieService.get('lang');
      this._language = lang ?? this.defaultLanguage;
    }
  }

  /**
   * This method is used internally. Use changeUserLanguage in ApiService instead of using this method.
   * @param newLanguage
   */
  _changeLanguage(newLanguage: string) {
    let expires = new Date();
    expires.setDate(expires.getDate() + 365 * 10);
    this.cookieService.put('language', newLanguage, { path: '/', expires: expires });
    this.translateService.use(newLanguage);
    this.eventService.emitChangeEvent({ type: 'language-change' });
    if (this.user !== null && this._user !== null) {
      this._user.language = newLanguage;
    }
  }

  get language(): string {
    return this._language;
  }

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
    let savedAdminUser = JSON.parse(localStorage.getItem('savedAdmin'));
    if (savedAdminUser) {
      this.store.dispatch(new AuthorizedUpdateTokenAction(savedAdminUser.accessToken));
      this.store.dispatch(new LogOutAsUserAction(this.user));
      localStorage.removeItem('savedAdmin');
      this.user$.next(savedAdminUser);
    }
  }

  openAsUser(user: User) {
    this.saveAdmin();
    this.user$.next(user);
    this.store.dispatch(new AuthorizedUpdateTokenAction(this.user.accessToken));
    this.store.dispatch(new AuthorizedUpdateUserAction(user));
    this.router.navigateByUrl('/');
  }

  checkInvitedByUrlParams() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    let urlParams = new URLSearchParams(window.location.search);
    let value = urlParams.get('rr');
    if (value) {
      let expires = new Date();
      expires.setDate(expires.getDate() + 180);
      this.cookieService.put('invitedByUserId', value, { path: '/', expires: expires });
    }
  }
}
