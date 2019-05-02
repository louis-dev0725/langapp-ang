import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../interfaces/common.interface';
import {Observable} from 'rxjs';
import {ApiError} from './api-error';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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

  get token(): string {
    return localStorage.getItem('token');
  }

  set token(value: string) {
    localStorage.setItem('token', value);
    this._token = value;
  }

  private _user: User;
  private _token: string;


  get apiHost(): string {
    return this.windowConfig.apiHost + this.windowConfig.apiPrefix;
  }

  get isAdmin(): boolean {
    return (this.user) ? this.user.isAdmin : false;
  }

  get isLoggedIn(): boolean {
    const token = this.token;
    return !!token;
  }

  get windowConfig(): any {
    return (window as any).rocket;
  }

  constructor(private http: HttpClient) {
  }

  //<editor-fold desc="Signup group">
  login(params: any): Observable<any | ApiError>  {
    return Observable.create((observer) => {
      this.http.post(this.apiHost + '/users/login', params)
        .subscribe((res: any) => {
          if (res.accessToken) {
            this.token = res.accessToken;
            this.getMeRequest(observer)
          } else {
            observer.next(res.message);
          }
        }, (err: any) => {
          observer.next(this.getApiError(err));
        })
    })
  }

  restorePasswordRequest(params: any): Observable<any> {
    return Observable.create((observer) => {
      this.http.post(this.apiHost + '/users/request-reset-password', params)
        .subscribe(() => {
          observer.next(true);
        }, (err) => {
          observer.next(this.getApiError(err));
        })
    })
  }

  changePassword(params: any): Observable<any> {
    return Observable.create((observer) => {
      this.http.post(this.apiHost + '/users/reset-password', params)
        .subscribe((res: any) => {
          this.token = res.accessToken;
          this.getMeRequest(observer);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })
  }

  signUp(params: any): Observable<any> {
    return Observable.create((observer) => {
      return this.http.post<User>(this.apiHost + '/users', params).subscribe((res) => {
        this.user = res;
        localStorage.setItem('token', this.user.accessToken);
        this.getMeRequest(observer);
      }, (error) => {
        observer.next(this.getApiError(error));
        observer.complete();
      });
    })
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  //</editor-fold>

  getTimeZones() {
    return this.http.get('/assets/timezones.json');
  }

  transactionList() {

  }

  private getApiError(response) {
    return new ApiError(response.error, response.ok, response.status, response.statusText);
  }


  //<editor-fold desc="Users group">

  updateUser(value: any) {
    const headers = this.getHeadersWithToken();
    this.http.patch(this.apiHost + '/users/update', value, {headers})
      .subscribe((res) => {
        console.log('update user res', res);
      })
  }

  private getMeRequest(observer) {

    const headers = this.getHeadersWithToken();

    this.http.get<User>(this.apiHost + '/users/me', {headers}).subscribe((userRes: any) => {
      this.user = userRes;
      observer.next(true);
    });
  }
  //</editor-fold>

  private getHeadersWithToken(): HttpHeaders {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'));
  }

}
