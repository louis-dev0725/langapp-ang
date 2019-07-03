import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../interfaces/common.interface';
import { Observable, of } from 'rxjs';
import {ApiError} from './api-error';
import {SessionService} from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly pageSize = 50;

  get apiHost(): string {
    return this.windowConfig.apiHost + this.windowConfig.apiPrefix;
  }

  get siteKey(): string {
    return this.windowConfig.siteKey;
  }

  get windowConfig(): any {
    return (window as any).rocket;
  }

  constructor(
    private http: HttpClient,
    private session: SessionService) {
  }

  //<editor-fold desc="Signup group">
  login(params: any): Observable<any | ApiError> {
    return Observable.create((observer) => {
      this.http.post(this.apiHost + '/users/login', params)
        .subscribe((res: any) => {
          if (res.accessToken) {
            this.session.token = res.accessToken;
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
          this.session.token = res.accessToken;
          this.getMeRequest(observer);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })
  }

  signUp(params: any): Observable<any> {
    return Observable.create((observer) => {
      return this.http.post<User>(this.apiHost + '/users', params).subscribe((res) => {
        this.session.user = res;
        this.session.token = this.session.user.accessToken;
        this.getMeRequest(observer);
      }, (error) => {
        observer.next(this.getApiError(error));
        observer.complete();
      });
    })
  }

  logout() {
    this.session.logout();
  }

  //</editor-fold>

  getTimeZones() {
    return this.http.get('/assets/timezones.json');
  }

  private getApiError(response) {
    if (response.status == 401) {
      this.logout();
    }
    if (response.error) {
      return new ApiError(response.error, response.ok, response.status, response.statusText);
    } else {
      return new ApiError([{field: 'all', message: 'Server error'}], false);
    }
  }


  //<editor-fold desc="Users group">

  /**
   * Get users list for admin
   * method: GET
   * url: /users/index
   */
  getAdminUsers(page = 0, filterParams: any = {}, sort: any = {}) {

    let params: any = {'per-page': this.pageSize};

    if (page > 0) {
      params.page = page + 1;
    }

    params = Object.assign(params, this.prepareFilter(filterParams));

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    const headers = this.getHeadersWithToken();
    return Observable.create((observer) => {
      this.http.get(this.apiHost + '/users', {headers, params}).subscribe((res) => {
        observer.next(res);
      }, (error) => {
        observer.next(this.getApiError(error));
      })
    })
  }

  /**
   * Get clients table list
   * method: POST
   * url: /users/<user id>/check-invited-users
   */
  getClientsList(userId: number = null): Observable<any> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      if (!userId) {
        userId = this.session.user.id;
      }
      this.http.get(
        this.apiHost + `/users/${userId}/invited-users`,
        {headers}
      ).subscribe((result) => {
        observer.next(result);
      }, (error) => {
        observer.next(this.getApiError(error))
      })
    })
  }

  checkInvitedUsers(userId: number = null): Observable<any> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      if (!userId) {
        userId = this.session.user.id;
      }
      this.http.post(
        this.apiHost + `/users/${userId}/check-invited-users`, {},
        {headers}
      ).subscribe((result) => {
        observer.next(result);
      }, (error) => {
        observer.next(this.getApiError(error))
      })
    })
  }

  meRequest(): Observable<any> {
    return Observable.create((observer) => {
      this.getMeRequest(observer);
    })
  }

  /**
   * Save user model/profile changes
   * method: PATCH
   * url: /users/update/
   * @param value
   */
  updateUser(value: any): Observable<any> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.patch<User>(this.apiHost + '/users/' + value.id, value, {headers})
        .subscribe((res) => {
          observer.next(res)
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })

  }

  private getMeRequest(observer, token = null, isCurrentUser = true) {

    const headers = this.getHeadersWithToken(token);

    this.http.get<User>(this.apiHost + '/users/me', {headers}).subscribe((userRes: any) => {
      if (isCurrentUser) {
        this.session.user = userRes;
      } else {
        this.session.tempUser = userRes;
      }
      observer.next(userRes);
    }, (error) => {
      observer.next(this.getApiError(error));
    });
  }

  //</editor-fold>

  //<editor-fold desc="Transactions">

  /**
   * Operations with filter
   * method: GET
   * url: /transactions?filter[<field name>]=<field value> [&...]
   */
  getTransactions(page = 0, filter: any = {}, sort: any = {}): Observable<any> {
    let params: any = {'per-page': this.pageSize};

    if (page > 0) {
      params.page = page;
    }

    params = Object.assign(params, this.prepareFilter(filter));

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    const headers = this.getHeadersWithToken();

    return Observable.create((observer) => {
      this.http.get(this.apiHost + '/transactions?field=*,user.id,user.name,user.accessToken&expand=user', {headers, params})
        .subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })

  }

  public getUserById(id: number) {
    const headers = this.getHeadersWithToken();
    return this.http.get(this.apiHost + `/users/${id}`, {headers});
  }
  public getTransactionById(id: number) {
    const headers = this.getHeadersWithToken();
    return this.http.get(this.apiHost + `/transactions/${id}`, {headers});
  }

  public getTransactionByUser(userId: number, partner = 0, sort = {}, page = 0): Observable<any> {
    const params: any = {userId: userId, isPartner: partner, 'per-page' : this.pageSize};
    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }
    if (page > 0) {
      params.page = page - 1;
    }
    const headers = this.getHeadersWithToken();
    return this.http.get(this.prepareTransactionsUrl(params), {headers})
  }

  private prepareTransactionsUrl(params: any = {}): string {
    let url = this.apiHost + '/transactions/index';
    if (Object.keys(params).length > 0) {
      url += '?';
    }
    const urlParams: any = [];
    if (params.userId) {
      urlParams.push(`filter[userId]=${this.session.user.id}`);
    }
    if (params.isPartner || params.isPartner == 0) {
      urlParams.push('filter[isPartner]=' + params.isPartner);
    }

    if (params.page) {
      urlParams.push('page=' + params.page);
    }

    if (params.sort) {
      urlParams.push('sort=' + params.sort);
    }

    return url + urlParams.join('&');
  }

  /**
   * Operations filtered by user
   * method: GET
   * url: /transactions/index?filter[userId]=<user id>
   */
  getUserTransactionsList(page = 0, sort = {}): Observable<any> {

    const params: any = {userId: this.session.user.id, 'per-page': this.pageSize};

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl(params), {headers})
        .subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })
  }

  /**
   * Operations filtered by user and isPartner flag
   * method: GET
   * url: /transactions/index?filter[userId]=<user id>&filter[isPartner]=1
   */
  getUserPartnersTransactionsList(page = 0, sort = {}): Observable<any> {

    const params: any = {userId: 1, isPartner: 1, 'per-page' : this.pageSize}

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return Observable.create((obsrver) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl(params), {headers})
        .subscribe((res) => {
          obsrver.next(res);
        }, (error) => {
          obsrver.next(this.getApiError(error));
        })
    })
  }

  createTransaction(data: any): Observable<any> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.post(this.apiHost + '/transactions/create', data, {headers})
        .subscribe((res) => {
          observer.next(res)
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })
  }

  updateTransaction(data: any): Observable<any> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      // this.http.patch(this.apiHost + '/transaction/update/' + data.id, data, {headers})
      this.http.patch(this.apiHost + '/transactions/' + data.id, data, {headers})
        .subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })
  }

  //</editor-fold>

  sendMessage(data: any) {
    const headers = this.getSimpleLanguageHeader();
    return this.http.post(this.apiHost + '/users/contact', data, {headers});
  }

  private getSimpleLanguageHeader(): HttpHeaders {
    const lang = this.session.lang;
    return new HttpHeaders()
      .append('Accept-Language', lang)
  }

  private getHeadersWithToken(token = null): HttpHeaders {
    if (!token) {
      token = localStorage.getItem('token');
    }
    return new HttpHeaders()
      .append('Accept-Language', localStorage.getItem('lang'))
      .append('Authorization', 'Bearer ' + token);
  }

  private prepareSort(sortObject: any): string {
    const res = Object.keys(sortObject).reduce((acc: string[], sortfield) => {
      if (sortObject[sortfield] === 'desc') {
        sortfield = '-' + sortfield;
      }
      acc.push(sortfield);
      return acc;
    }, []);
    return res.join(',');
  }


  private prepareFilter(filter: any): any {
    const params: any = {};
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach((filterKey) => {
        params[`filter[${filterKey}]`] = filter[filterKey];
      })
    }
    return params;
  }

  getUserByToken(token: string): Observable<any> {
    return Observable.create((observer) => {
      this.getMeRequest(observer, token, false);
    })
  }


}
