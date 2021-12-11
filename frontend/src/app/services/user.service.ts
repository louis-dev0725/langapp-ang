import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import * as fromStore from '@app/store';
import { AuthorizedUpdateTokenAction, LogOutAction, LogOutAsUserAction } from '@app/store';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public user$ = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private store: Store<fromStore.State>) {}

  get apiHost(): string {
    return environment.apiUrl;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.reloadAdmin();
    this.store.dispatch(new LogOutAction());
    this.router.navigate(['auth/signin']);
  }

  reloadAdmin() {
    const savedAdminUser = JSON.parse(localStorage.getItem('savedAdmin'));
    if (savedAdminUser) {
      this.store.dispatch(new AuthorizedUpdateTokenAction(savedAdminUser.accessToken));
      this.store.dispatch(new LogOutAsUserAction(this.user$.value));
      localStorage.removeItem('savedAdmin');
      this.user$.next(savedAdminUser);
    }
  }

  getMeRequest(token = null, isCurrentUser = true) {
    const headers = this.getHeadersWithToken(token);

    return this.http.get<User>(this.apiHost + '/users/me', { headers });
  }

  getApiError(response) {
    if (response.status === 401) {
      this.logout();
    }
    if (response.error) {
      return new ApiError(response.error, response.ok, response.status, response.statusText);
    } else {
      return new ApiError([{ field: 'all', message: 'Server error' }], false);
    }
  }

  getHeadersWithToken(token = null): HttpHeaders {
    if (!token) {
      token = localStorage.getItem('token');
    }
    return new HttpHeaders().append('Accept-Language', localStorage.getItem('lang')).append('Authorization', 'Bearer ' + token);
  }
}
