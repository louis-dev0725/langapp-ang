import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Category, Content, UserDictionary, ListResponse, Mnemonic, SettingPlugin, User, UserPaymentMethod, AddCardSquareRequest, ProlongSubscriptionResult, ContentAttributeResponse, ContentStudiedAttributeRequest, ContentHiddenAttributeRequest, Training, Drill, TrainingEndMessage, TrainingSetting, Hidings, StripeSetupIntentResponse } from '@app/interfaces/common.interface';
import { Observable, of, throwError } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';
import { Store } from '@ngrx/store';
import * as fromStore from '@app/store/index';
import { AuthorizedUpdateTokenAction, LoadAccount, LoadAccountFail, LoadAccountSuccess, LoadAuthorizedSuccess } from '@app/store/index';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { APP_BASE_HREF } from '@angular/common';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';

type ParamsInterface =
  | HttpParams
  | {
      [param: string]: string | string[];
    };

type HeadersInterface =
  | HttpHeaders
  | {
      [header: string]: string | string[];
    };

interface OptionsInterface {
  body?: any;
  headers?: HeadersInterface;
  params?: ParamsInterface;
  reportProgress?: boolean;
  observe?: 'body';
  responseType?: 'json';
  withCredentials?: boolean;
}

export interface SimpleListItem {
  title: string;
  value: any;
}

export interface ReportRequest {
  contentId: number;
  userText: string;
}

export interface ReportResponse {
  id: number;
  userId: number;
  contentId: number;
  userText: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly pageSize = 50;

  get apiHost(): string {
    return environment.apiUrl;
  }

  get siteKey(): string {
    return environment.siteKey;
  }

  constructor(private http: HttpClient, private session: SessionService, private store: Store<fromStore.State>, private messageService: MessageService, @Inject(APP_BASE_HREF) private baseHref: string, private userService: UserService, private router: Router) {}

  apiRequest<T>(method: string, path: string, options: OptionsInterface = {}, catchValidationErrors = false) {
    return <Observable<T>>this.http.request<T>(method, this.apiHost + '/' + path, options).pipe(catchError((r) => this.handleError(r, catchValidationErrors)));
  }

  private handleError(response: HttpErrorResponse, catchValidationErrors = false) {
    console.log(response);
    if (response.error instanceof ErrorEvent) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error: Unable to connect to server',
        detail: response.error.message,
        sticky: true,
        closable: true,
      });
      //return of(new ApiError([{ field: 'all', message: 'Unable to connect to server. Error: ' + response.error.message }], false));
    } else if (response.error) {
      if (response.error?.[0]) {
        if (catchValidationErrors) {
          let fieldsErrorText = response.error?.[0]?.message ? response.error.map((e) => e.message).join('\n') : '';
          this.messageService.add({
            severity: 'error',
            summary: 'Server error',
            detail: response.statusText + '\n' + fieldsErrorText,
            sticky: true,
            closable: true,
          });
        }
        return of(new ApiError(response.error, response.ok, response.status, response.statusText));
      } else if (response.error.message) {
        if (response.error.status === 402) {
          this.router.navigate(['payment']);
          this.messageService.add({
            severity: 'error',
            summary: 'Please check your payment details',
            detail: 'Payment required to continue using the service.',
            sticky: true,
            closable: true,
          });
          return throwError(response);
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Server error: ' + response.error.message,
          detail: response.message,
          sticky: true,
          closable: true,
        });
      } else if (response.message) {
        this.messageService.add({ severity: 'error', summary: 'Server error', detail: response.message, sticky: true, closable: true });
      }
      //return of(new ApiError(response.error, response.ok, response.status, response.statusText));
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Unknown error',
        detail: response.error.toString(),
        sticky: true,
        closable: true,
      });
      //return of(new ApiError([{ field: 'all', message: 'Unknown error' }], false));
    }

    return throwError(response);
  }

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
          observer.next(this.userService.getApiError(err));
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
        (err) => {
          observer.next(this.userService.getApiError(err));
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
        (error) => {
          observer.next(this.userService.getApiError(error));
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
        (res) => {
          this.userService.user$.next(res);
          this.store.dispatch(new AuthorizedUpdateTokenAction(this.userService.user$.value.accessToken));
          this.getMeRequest(observer);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
          observer.complete();
        }
      );
    });
  }

  changeUserLanguage(newLanguage: string) {
    this.session._changeLanguage(newLanguage);
    if (this.userService.user$.value !== null) {
      this.updateUser({ id: this.userService.user$.value.id, language: newLanguage }).subscribe(() => {});
    }
  }

  /**
   * Выход
   */
  logout() {
    this.userService.logout();
  }
  // </editor-fold>

  /**
   * Получаем часовые пояса
   */
  getTimeZones() {
    return this.http.get(this.baseHref + '/assets/timezones.json');
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

    const headers = this.userService.getHeadersWithToken();
    return this.http.get(this.apiHost + '/users', { headers, params });
  }

  /**
   * Get clients table list
   * method: POST
   * url: /users/<user id>/check-invited-users
   */
  getClientsList(userId: number = null): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      if (!userId) {
        userId = this.userService.user$.value.id;
      }
      this.http.get(this.apiHost + `/users/${userId}/invited-users`, { headers }).subscribe(
        (result) => {
          observer.next(result);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Что-то связанное с партнёрской программой
   */
  checkInvitedUsers(userId: number = null): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      if (!userId) {
        userId = this.userService.user$.value.id;
      }
      this.http.post(this.apiHost + `/users/${userId}/check-invited-users`, {}, { headers }).subscribe(
        (result) => {
          observer.next(result);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
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

  updateUser(value: Partial<User>): Observable<User> {
    return this.apiRequest<User>('PATCH', 'users/' + value.id, { body: value }).pipe(
      tap((user) => {
        this.userService.user$.next(user);
      })
    );
  }

  /**
   * Получаем авторизованного пользователя(себя), сам запрос
   */
  private getMeRequest(observer, token = null, isCurrentUser = true) {
    // TODO: Headers not required as they already set in http interceptor?
    const headers = this.userService.getHeadersWithToken(token);

    this.http
      .get<User>(this.apiHost + '/users/me', { headers })
      .subscribe(
        (userRes: any) => {
          this.store.dispatch(new LoadAuthorizedSuccess(userRes));
          this.userService.user$.next(userRes);
          observer.next(userRes);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
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
    const headers = this.userService.getHeadersWithToken();
    return new Observable((observer) => {
      this.http.get(this.apiHost + '/transactions?field=*,user.id,user.name,user.accessToken&expand=user', { headers, params }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем пользователя по id
   */
  public getUserById(id: number) {
    const headers = this.userService.getHeadersWithToken();
    return this.http.get(this.apiHost + `/users/${id}`, { headers });
  }

  /**
   * Получаем транзакцию по id
   */
  public getTransactionById(id: number) {
    const headers = this.userService.getHeadersWithToken();
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
    const headers = this.userService.getHeadersWithToken();
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
    const params: any = { userId: this.userService.user$.value?.id, 'per-page': this.pageSize };

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl(params), { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
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
    const params: any = { userId: this.userService.user$.value?.id, isPartner: 1, 'per-page': this.pageSize };

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.prepareTransactionsUrl(params), { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Создаём транзакцию
   */
  createTransaction(data: any): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.post(this.apiHost + '/transactions/create', data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Обновляем транзакцию
   */
  updateTransaction(data: any): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.patch(this.apiHost + '/transactions/' + data.id, data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Получение всех категорий
   */
  getCategories(): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/categories', { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Получение всех категорий с пагинацией
   */
  getAllCategories(data: any = ''): Observable<any> {
    return new Observable((observer) => {
      let query = '';
      if (data !== '') {
        query = '&' + data;
      }
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/categories/all?expand=parentCategory' + query, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Создаём категорию
   */
  createCategory(data: Category): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.post(this.apiHost + '/categories/create', data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем определённую категорию
   *
   * @param id
   */
  getCategoryById(id: number): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + `/categories/${id}`, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Изменяем категорию
   */
  updateCategory(data: Category): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.patch(this.apiHost + '/categories/' + data.id, data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Удаляем определённую категорию
   *
   * @param id
   */
  deleteCategory(id: number): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.delete(this.apiHost + `/categories/${id}`, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Псевдо получение типов контента
   */
  getContentTypes(): Observable<SimpleListItem[]> {
    return of([
      { value: '1', title: 'Text' },
      { value: '2', title: 'Audio' },
      { value: '3', title: 'Video' },
    ]);
  }

  /**
   * Псевдо получение объемов текста
   */
  getContentLengthVariants(): Observable<SimpleListItem[]> {
    return of([
      { value: { gt: '0', lt: '500' }, title: 'Small (0-500)' },
      { value: { gt: '501', lt: '2500' }, title: 'Medium (501-2500)' },
      { value: { gt: '2501', lt: '5000' }, title: 'Big (2501-5000)' },
      { value: { gt: '5000' }, title: 'Very big (>5000)' },
    ]);
  }

  /**
   * Псевдо получение сложности текста
   */
  getContentLevels(): Observable<SimpleListItem[]> {
    return of([
      { value: '1', title: 'JLPT N1' },
      { value: '2', title: 'JLPT N2' },
      { value: '3', title: 'JLPT N3' },
      { value: '4', title: 'JLPT N4' },
      { value: '5', title: 'JLPT N5' },
    ]);
  }

  contentList(params: ParamsInterface) {
    return this.apiRequest<ListResponse<Content>>('GET', 'contents', { params }, true);
  }

  contentById(id: number): Observable<Content> {
    return this.apiRequest<Content>('GET', `contents/${id}`, {
      params: {
        expand: 'recommendedVideos,categories,contentAttribute',
      },
    });
  }

  /**
   * Получаем список материалов с фильтром
   */
  getMaterials(data: any): Observable<any> {
    return new Observable((observer) => {
      let query = '';
      if (data !== '') {
        query = '?' + data;
      }
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/contents/index' + query, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Создаём материал
   */
  createMaterials(data: Content): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.post(this.apiHost + '/contents/create', data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Изменяем материал
   */
  updateMaterials(data: Content): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.patch(this.apiHost + '/contents/' + data.id, data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Удаляем определённый материал
   *
   * @param id
   */
  deleteMaterial(id: number): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.delete(this.apiHost + `/contents/${id}`, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем все доступные языки
   */
  getAllLanguage(): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/languages/all', { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  getUserDictionary(params: ParamsInterface) {
    return this.apiRequest<ListResponse<UserDictionary>>('GET', 'dictionaries/index', { params: params });
  }

  getComboStudy(params: ParamsInterface) {
    params['expand'] = 'dictionaryWord,mnemonic';
    return this.apiRequest<ListResponse<UserDictionary>>('GET', 'dictionaries/combo-study', { params: params });
  }

  /**
   * Получаем список слов и канзи и пользовательского словаря без пагинации
   */
  getAllUserDictionary(data: any): Observable<any> {
    return new Observable((observer) => {
      let query = '';
      if (data !== '') {
        query = '?' + data;
      }
      query += '&expand=dictionaryWord,mnemonic';

      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/dictionaries/all' + query, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Получаем связанные слова с кандзи
   */
  getQueryUserDictionary(data: any): Observable<any> {
    return new Observable((observer) => {
      let query = '';
      if (data !== '') {
        query = '?' + data;
      }
      query += '&expand=dictionaryWord,mnemonicsUsers';

      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/dictionaries/query-one' + query, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Изменяем слова из пользовательского словаря
   */
  updateUserDictionary(data: UserDictionary): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.patch(this.apiHost + '/dictionaries/' + data.id, data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Удаляем выделенные элементы(слова или иероглифы)
   *
   * @param ids
   */
  deleteUserDictionaries(ids: number[]): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.post(this.apiHost + '/dictionaries/delete-select', ids, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Удаляем выделенный элемент(слово или иероглиф)
   *
   * @param id
   */
  deleteUserDictionary(id: number): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.delete(this.apiHost + `/dictionaries/${id}`, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
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
    const lang = this.session.language;
    return new HttpHeaders().append('Accept-Language', lang);
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

  /**
   * Вроде закрываем уведомление
   */
  onCloseNotify(data) {
    const headers = this.userService.getHeadersWithToken();
    return this.http.post(this.apiHost + '/users/close-notification', data, { headers });
  }

  /**
   * Получаем мнемоники
   */
  getMnemonics(data): Observable<any> {
    return new Observable((observer) => {
      let query = '';
      if (data !== '') {
        query = '?' + data;
      }
      query += '&expand=mnemonicsUsers';

      const headers = this.userService.getHeadersWithToken();
      this.http.get(this.apiHost + '/mnemonics/index' + query, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Создаём мнемонику
   */
  createMnemonic(data): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.post(this.apiHost + '/mnemonics/create', data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  /**
   * Обновляем мнемонику
   */
  updateMnemonic(data: Mnemonic): Observable<any> {
    return new Observable((observer) => {
      const headers = this.userService.getHeadersWithToken();
      this.http.patch(this.apiHost + '/mnemonics/' + data.id, data, { headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          observer.next(this.userService.getApiError(error));
        }
      );
    });
  }

  getUserPaymentMethods() {
    return this.apiRequest<UserPaymentMethod[]>('GET', `users/my-payment-methods`);
  }

  addCardSquare(body: AddCardSquareRequest) {
    return this.apiRequest<UserPaymentMethod[]>('POST', `users/add-card-square`, { body: body }, true);
  }

  deletePaymentMethod(id: number) {
    return this.apiRequest<UserPaymentMethod[]>(
      'POST',
      `users/delete-payment-method`,
      {
        body: {
          id,
        },
      },
      true
    );
  }

  prolongSubscription() {
    return this.apiRequest<ProlongSubscriptionResult>('POST', `users/prolong-subscription`, {}, true);
  }

  setContentStudiedAttribute(contentId: number, body: ContentStudiedAttributeRequest) {
    return this.apiRequest<ContentAttributeResponse>('PATCH', `content-attributes/${contentId}`, { body });
  }

  setContentHiddenAttribute(contentId: number, body: ContentHiddenAttributeRequest) {
    return this.apiRequest<ContentAttributeResponse>('PATCH', `content-attributes/${contentId}`, { body });
  }

  sendReport(body: ReportRequest): Observable<ReportResponse> {
    return this.apiRequest<ReportResponse>('POST', 'content-reports', { body });
  }

  getTrainingCards(): Observable<Training> {
    return this.apiRequest<Training>('GET', 'drills/list');
  }

  reportTrainingDrills(body: { drills: Drill[] }): Observable<TrainingEndMessage> {
    return this.apiRequest<TrainingEndMessage>('POST', 'drills/report-progress', { body });
  }

  saveTrainingSetting(body: TrainingSetting): Observable<TrainingSetting> {
    return this.apiRequest<TrainingSetting>('PATCH', 'drills/settings', { body });
  }

  saveTrainingHidings(body: Hidings): Observable<{ drills: Drill[] }> {
    return this.apiRequest<{ drills: Drill[] }>('POST', 'drills/hide', { body });
  }

  getTrainingCardById(cardId: string): Observable<any> {
    return this.apiRequest<any>('GET', 'drills/card', {
      params: {
        id: cardId,
      },
    });
  }

  getStripeSetupIntent(): Observable<StripeSetupIntentResponse> {
    return this.apiRequest<StripeSetupIntentResponse>('GET', 'users/stripe-setup-intent');
  }

  stripeAddPaymentMethod(stripePaymentMethodId: string) {
    return this.apiRequest<UserPaymentMethod[]>(
      'POST',
      `users/stripe-add-payment-method`,
      {
        body: {
          stripePaymentMethodId,
        },
      },
      true
    );
  }
}
