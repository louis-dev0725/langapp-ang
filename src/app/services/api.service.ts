import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../interfaces/common.interface';
import {Observable} from 'rxjs';

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
    return  (this._token) ? this._token : localStorage.getItem('token');
  }

  set token(value: string) {
    localStorage.setItem('token', value);
    this._token = value;
  }

  private _user: User;
  private _token: string;


  get apiHost(): string {
    return  this.windowConfig.apiHost + this.windowConfig.apiPrefix;
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

  constructor(private http: HttpClient) { }

  //<editor-fold desc="Signup group">
  login(params: any): Observable<any> {
    return Observable.create((observer) => {
      this.http.post(this.apiHost + '/users/login', params)
        .subscribe((res: any) => {
          if (res.accessToken) {
            this.token = res.accessToken;
            this.getMeRequest(observer)
          } else {
            observer.next(res.message);
          }
        })
    })
  }

  restorePasswordRequest(params: any) {
    this.http.post(this.apiHost + '/users/request-reset-password', params)
      .subscribe((res) => {
        // empty subscription to prevent optimize remove request
      })
  }

  changePassword(params: any): Observable<any> {
    return Observable.create((observer) => {
      this.http.post(this.apiHost + '/users/reset-password', params)
        .subscribe((res: any) => {
          this.token = res.accessToken;
          this.getMeRequest(observer);
        })
    })
  }

  signUp(params: any): Observable<any> {
    return Observable.create((observer) => {
      return this.http.post<User>(this.apiHost + '/users', params).subscribe((res) => {
        this.user = res;
        observer.complete();
      }, (error) => {
        observer.next(false);
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

  transactionList() {

  }

  private getMeRequest(observer) {
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    this.http.get<User>(this.apiHost + '/users/me', {headers: headers}).subscribe((userRes: any) => {
      this.user = userRes;
      observer.next(true);
    });
  }

}
