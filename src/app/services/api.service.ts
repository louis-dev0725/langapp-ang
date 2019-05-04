import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InvitedUser, Operations, User} from '../interfaces/common.interface';
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
  login(params: any): Observable<any | ApiError> {
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

  private getApiError(response) {
    if (response.error) {
      return new ApiError(response.error, response.ok, response.status, response.statusText);
    } else {
      return new ApiError([{field: 'all', message: 'Server error'}], false);
    }
  }


  //<editor-fold desc="Users group">

  /**
   * Get clients table list
   * method: POST
   * url: /users/<user id>/check-invited-users
   */
  getClientsList(): Observable<InvitedUser> | Observable<ApiError> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.post(this.apiHost + `/users/${this.user.id}/check-invited-users`, {headers}).subscribe((result) => {
        observer.next(result);
      }, (error) => {
        observer.next(this.getApiError(error))
      })
    })
  }

  /**
   * Operations filtered by user
   * method: GET
   * url: /transactions/index?filter=<user id>
   */
  getUserTransactionsList(): Observable<any>{
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.apiHost + `/transactions/index?filter[userId]=${this.user.id}`, {headers})
        .subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })
  }

  /**
   * Save user model/profile changes
   * method: PATCH
   * url: /users/update/
   * @param value
   */
  updateUser(value: any): Observable<any>{
    // todo: [SHR]: link to update in php code is differ than postman api
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.patch(this.apiHost + '/users/update/' + value.id, value, {headers})
        .subscribe((res) => {
          observer.next(res)
        }, (error) => {
          observer.next(this.getApiError(error));
        })
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
