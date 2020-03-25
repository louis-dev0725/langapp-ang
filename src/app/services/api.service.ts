import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Materials, TypeContent, User } from '../interfaces/common.interface';
import { Observable } from 'rxjs';
import { ApiError } from './api-error';
import { SessionService } from './session.service';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store';
import { LoadAccount, LoadAccountFail, LoadAccountSuccess, AuthorizedUpdateTokenAction,
  LoadAuthorizedSuccess } from '@app/store';


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

  constructor(private http: HttpClient, private session: SessionService, private store: Store<fromStore.State>) {}

  /**
   * Авторизация
   */
  login(params: any): Observable<any | ApiError> {
    this.store.dispatch(new LoadAccount());
    return new Observable((observer) => {
      this.http.post(this.apiHost + '/users/login', params).subscribe(
        (res: any) => {
          if (res.accessToken) {
            this.store.dispatch(new LoadAccountSuccess(res));
            this.store.dispatch(new AuthorizedUpdateTokenAction(res.accessToken));
            this.getMeRequest(observer);
          } else {
            observer.next(res.message);
          }
        },
        (err: any) => {
          console.log(err);
          this.store.dispatch(new LoadAccountFail(err));
          observer.next(this.getApiError(err));
        }
      );
    });
  }

  /**
   * Забыли пароль
   */
  restorePasswordRequest(params: any): Observable<any> {
    return new Observable((observer) => {
      this.http.post(this.apiHost + '/users/request-reset-password', params).subscribe(
        () => {
          observer.next(true);
        },
        err => {
          observer.next(this.getApiError(err));
        }
      );
    });
  }

  /**
   * Смена пароля
   */
  changePassword(params: any): Observable<any> {
    return new Observable((observer) => {
      this.http.post(this.apiHost + '/users/reset-password', params).subscribe(
        (res: any) => {
          this.store.dispatch(new AuthorizedUpdateTokenAction(res.accessToken));
          this.getMeRequest(observer);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Регистрация
   */
  signUp(params: any): Observable<any> {
    return new Observable((observer) => {
      return this.http.post<User>(this.apiHost + '/users', params).subscribe(
        res => {
          this.session.user = res;
          this.store.dispatch(new AuthorizedUpdateTokenAction(this.session.user.accessToken));
          this.getMeRequest(observer);
        },
        error => {
          observer.next(this.getApiError(error));
          observer.complete();
        }
      );
    });
  }

  /**
   * Выход
   */
  logout() {
    this.session.logout();
  }
  // </editor-fold>

  /**
   * Получаем часовые пояса
   */
  getTimeZones() {
    return this.http.get('/assets/timezones.json');
  }

  /**
   * Вывод api ошибки
   */
  private getApiError(response) {
    if (response.status === 401) {
      this.logout();
    }
    if (response.error) {
      return new ApiError(response.error, response.ok, response.status, response.statusText);
    } else {
      return new ApiError([{ field: 'all', message: 'Server error' }], false);
    }
  }

  /**
   * Get users list for admin
   * method: GET
   * url: /users/index
   */
  getAdminUsers(page = 0, filterParams: any = {}, sort: any = {}) {
    let params: any = { 'per-page': this.pageSize };

    if (page > 0) {
      params.page = page + 1;
    }

    params = Object.assign(params, this.prepareFilter(filterParams));

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    const headers = this.getHeadersWithToken();
    return this.http.get(this.apiHost + '/users', { headers, params });
  }

  /**
   * Get clients table list
   * method: POST
   * url: /users/<user id>/check-invited-users
   */
  getClientsList(userId: number = null): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      if (!userId) {
        userId = this.session.user.id;
      }
      this.http.get(this.apiHost + `/users/${userId}/invited-users`, { headers }).subscribe(
        result => {
          observer.next(result);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Что-то связанное с партнёрской программой
   */
  checkInvitedUsers(userId: number = null): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      if (!userId) {
        userId = this.session.user.id;
      }
      this.http.post(this.apiHost + `/users/${userId}/check-invited-users`, {}, { headers }).subscribe(
        result => {
          observer.next(result);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем авторизованного пользователя(себя)
   */
  meRequest(): Observable<any> {
    return new Observable((observer) => {
      this.getMeRequest(observer);
    });
  }

  /**
   * Save user model/profile changes
   * method: PATCH
   * url: /users/update/
   * @var value
   */
  updateUser(value: any): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.patch<User>(this.apiHost + '/users/' + value.id, value, { headers }).subscribe(
        res => {
          observer.next(res);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем авторизованного пользователя(себя), сам запрос
   */
  private getMeRequest(observer, token = null, isCurrentUser = true) {
    const headers = this.getHeadersWithToken(token);

    this.http.get<User>(this.apiHost + '/users/me', { headers }).subscribe(
      (userRes: any) => {
        this.store.dispatch(new LoadAuthorizedSuccess(userRes));
        this.session.user = userRes;
        observer.next(userRes);
      },
      error => {
        observer.next(this.getApiError(error));
      }
    );
  }

  /**
   * Operations with filter
   * method: GET
   * url: /transactions?filter[<field name>]=<field value> [&...]
   */
  getTransactions(page = 0, filter: any = {}, sort: any = {}): Observable<any> {
    let params: any = { 'per-page': this.pageSize };

    if (page > 0) {
      params.page = page;
    }

    params = Object.assign(params, this.prepareFilter(filter));

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }
    const headers = this.getHeadersWithToken();
    return new Observable((observer) => {
      this.http.get(this.apiHost + '/transactions?field=*,user.id,user.name,user.accessToken&expand=user', { headers, params }).subscribe(
        res => {
          observer.next(res);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем пользователя по id
   */
  public getUserById(id: number) {
    const headers = this.getHeadersWithToken();
    return this.http.get(this.apiHost + `/users/${id}`, { headers });
  }

  /**
   * Получаем транзакцию по id
   */
  public getTransactionById(id: number) {
    const headers = this.getHeadersWithToken();
    return this.http.get(this.apiHost + `/transactions/${id}`, { headers });
  }

  /**
   * Получаем транзакции пользователя
   */
  public getTransactionByUser(userId: number, partner = 0, sort = {}, page = 0): Observable<any> {
    const params: any = { userId: userId, isPartner: partner, 'per-page': this.pageSize };
    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }
    if (page > 0) {
      params.page = page - 1;
    }
    const headers = this.getHeadersWithToken();
    return this.http.get(this.prepareTransactionsUrl(params), { headers });
  }

  /**
   * Получаем все транзакции пользователя ... вроде
   */
  private prepareTransactionsUrl(params: any = {}): string {
    let url = this.apiHost + '/transactions/index';
    if (Object.keys(params).length > 0) {
      url += '?';
    }
    const urlParams: any = [];
    if (params.userId) {
      urlParams.push(`filter[userId]=${params.userId}`);
    }
    if (params.isPartner || params.isPartner === 0) {
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
    const params: any = { userId: this.session.user.id, 'per-page': this.pageSize };

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl(params), { headers }).subscribe(
        res => {
          observer.next(res);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Operations filtered by user and isPartner flag
   * method: GET
   * url: /transactions/index?filter[userId]=<user id>&filter[isPartner]=1
   */
  getUserPartnersTransactionsList(page = 0, sort = {}): Observable<any> {
    const params: any = { userId: this.session.user.id, isPartner: 1, 'per-page': this.pageSize };

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl(params), { headers }).subscribe(
        res => {
          observer.next(res);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Создаём транзакцию
   */
  createTransaction(data: any): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.post(this.apiHost + '/transactions/create', data, { headers }).subscribe(
        res => {
          observer.next(res);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Обновляем транзакцию
   */
  updateTransaction(data: any): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.patch(this.apiHost + '/transactions/' + data.id, data, { headers }).subscribe(
        res => {
          observer.next(res);
        },
        error => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Получение всех категорий
   */
  getCategories(): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.get(this.apiHost + '/categories', { headers }).subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Создаём материал
   */
  createMaterials(data: Materials): Observable<any> {
    return new Observable((observer) => {
      const headers = this.getHeadersWithToken();
      this.http.post(this.apiHost + '/contents/create', data, { headers }).subscribe((res) => {
          observer.next(res);
        }, (error) => {
          observer.next(this.getApiError(error));
        }
      );
    });
  }

  /**
   * Псевдо получение типов контента
   */
  getTypeContent(): Observable<any> {
    return new Observable((observer) => {
      const typeContent = [
        { id: 1, title: 'Текст'},
        { id: 2, title: 'Аудио'},
        { id: 3, title: 'Видео'},
      ];
      observer.next(typeContent);
    });
  }

  /**
   * Отправляем email(Обратная связь)
   */
  sendMessage(data: any) {
    const headers = this.getSimpleLanguageHeader();
    return this.http.post(this.apiHost + '/users/contact', data, { headers });
  }

  /**
   * Получаем язык приложения
   */
  private getSimpleLanguageHeader(): HttpHeaders {
    const lang = this.session.lang;
    return new HttpHeaders().append('Accept-Language', lang);
  }

  /**
   * Устанавливаем необходимые заголовки
   */
  private getHeadersWithToken(token = null): HttpHeaders {
    if (!token) {
      token = localStorage.getItem('token');
    }
    return new HttpHeaders().append('Accept-Language', localStorage.getItem('lang')).append('Authorization', 'Bearer ' + token);
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
      Object.keys(filter).forEach(filterKey => {
        params[`filter[${filterKey}]`] = filter[filterKey];
      });
    }
    return params;
  }

  /**
   * Получаем пользователя по токену
   */
  getUserByToken(token: string): Observable<any> {
    return new Observable((observer) => {
      this.getMeRequest(observer, token, false);
    });
  }

  onCloseNotify(data) {
    const headers = this.getHeadersWithToken();
    return this.http.post(this.apiHost + '/users/close-notification', data, { headers });
  }
}
