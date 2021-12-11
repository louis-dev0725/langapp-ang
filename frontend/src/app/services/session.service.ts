import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '@app/interfaces/common.interface';
import { Router } from '@angular/router';
import * as fromStore from '@app/store/index';
import {
  AuthorizedSaveAdminAction,
  AuthorizedUpdateTokenAction,
  AuthorizedUpdateUserAction,
  LoadAuthorizedSuccess,
} from '@app/store/index';

import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '@app/event.service';
import { CookieService } from 'ngx-cookie';
import { isPlatformServer } from '@angular/common';
import { UserService } from '@app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private defaultLanguage = 'en';
  private _language: string;

  public user$ = this.userService.user$;
  private _user: User;

  constructor(
    private router: Router,
    private store: Store<fromStore.State>,
    private translateService: TranslateService,
    private eventService: EventService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: any,
    private userService: UserService
  ) {
    this.init();
  }

  init() {
    this.userService.user$.subscribe((user) => {
      if (!this._user || this._user?.language !== user?.language || this._language !== user?.language) {
        this._language = user?.language;
        this._changeLanguage(user?.language);
      }

      this._user = user;
      localStorage.setItem('user', JSON.stringify(user));
    });

    if (!this._user) {
      this.userService.getMeRequest().subscribe(
        (userRes: any) => {
          this.store.dispatch(new LoadAuthorizedSuccess(userRes));
          this.userService.user$.next(userRes);
        },
        (error) => {
          this.userService.getApiError(error);
        }
      );
    }

    if (!this._language) {
      const lang = this.cookieService.get('lang');
      this._language = lang ?? this.defaultLanguage;
    }
  }

  /**
   * This method is used internally. Use changeUserLanguage in ApiService instead of using this method.
   * @param newLanguage
   */
  _changeLanguage(newLanguage: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365 * 10);
    this.cookieService.put('language', newLanguage, { path: '/', expires: expires });
    this.translateService.use(newLanguage);
    this.eventService.emitChangeEvent({ type: 'language-change' });
  }

  get language(): string {
    return this._language;
  }

  get isAdmin(): boolean {
    return this._user ? this._user.isAdmin : false;
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

  saveAdmin() {
    const token = localStorage.getItem('token');
    const _user = { ...this._user };
    _user['accessToken'] = token;
    this.store.dispatch(new AuthorizedSaveAdminAction(_user));
    localStorage.setItem('savedAdmin', JSON.stringify(_user));
  }

  openAsUser(user: User) {
    this.saveAdmin();
    this.user$.next(user);
    this.store.dispatch(new AuthorizedUpdateTokenAction(this._user.accessToken));
    this.store.dispatch(new AuthorizedUpdateUserAction(user));
    this.router.navigateByUrl('/');
  }

  checkInvitedByUrlParams() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('rr');
    if (value) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 180);
      this.cookieService.put('invitedByUserId', value, { path: '/', expires: expires });
    }
  }
}
