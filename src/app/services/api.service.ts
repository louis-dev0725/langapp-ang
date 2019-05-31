import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../interfaces/common.interface';
import {Observable} from 'rxjs';
import {ApiError} from './api-error';
import {SessionService} from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

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
    let params: any = {};

    if (page > 0) {
      // note: [SHR] if need to change items per page - do it via "per-page" param
      params.page = page;
    }

    params = Object.assign(params, this.prepareFilter(filterParams));

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    const headers = this.getHeadersWithToken();
    return Observable.create((observer) => {
      this.http.get(this.apiHost + '/users/index', {headers, params}).subscribe((res) => {
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
      observer.next(true);
    });
  }

  //</editor-fold>

  //<editor-fold desc="Transactions">

  getTransactions(page = 0, filter: any = {}, sort: any = {}): Observable<any> {
    let params: any = {};

    if (page > 0) {
      params.page = page;
    }

    params = Object.assign(params, this.prepareFilter(filter));

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    const headers = this.getHeadersWithToken();

    return Observable.create((observer) => {
      this.http.get(this.apiHost + '/transactions', {headers, params})
        .subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        })
    })

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
    if (params.isParnter) {
      urlParams.push('filter[isPartner]');
    }
    return url + urlParams.join('&');
  }

  /**
   * Operations filtered by user
   * method: GET
   * url: /transactions/index?filter[userId]=<user id>
   */
  getUserTransactionsList(): Observable<any> {
    return Observable.create((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl({userId: 1}), {headers})
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
  getUserPartnersTransactionsList(): Observable<any> {
    return Observable.create((obsrver) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl({userId: 1, isPartner: 1}), {headers})
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
