import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Category, Content, UserDictionary, ListResponse, Mnemonic, User, UserPaymentMethod, AddCardSquareRequest, ProlongSubscriptionResult, ContentAttributeResponse, ContentStudiedAttributeRequest, ContentHiddenAttributeRequest, Training, Drill, TrainingEndMessage, TrainingSetting, Hidings, StripeSetupIntentResponse, CategoryArray } from '@app/interfaces/common.interface';
import { Observable, of, throwError } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { APP_BASE_HREF } from '@angular/common';
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

  constructor(private http: HttpClient, private session: SessionService, private messageService: MessageService, @Inject(APP_BASE_HREF) private baseHref: string, private router: Router, private sessionSerivce: SessionService) {}

  apiRequest<T>(method: string, path: string, options: OptionsInterface = {}, catchValidationErrors = false) {
    // console.trace('apiRequest', { method, path, options, catchValidationErrors });
    return <Observable<T>>this.http.request<T>(method, this.apiHost + '/' + path, options).pipe(catchError((r) => this.handleError(r, catchValidationErrors)));
  }

  private handleError(response: HttpErrorResponse, catchValidationErrors = false) {
    if (response.error instanceof ErrorEvent) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error: Unable to connect to server',
        detail: response.error.message,
        sticky: true,
        closable: true,
      });
      return of(this._generalError(response, 'Unable to connect to server.'));
    } else if (response.error) {
      if (response.error?.[0]) {
        if (catchValidationErrors) {
          let fieldsErrorText = response.error?.[0]?.message ? response.error.map((e) => e.message).join('\n') : '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
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
          // return of(this._generalError(response, 'Payment required to continue using the service.'));
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error: ' + response.error.message,
          detail: response.message,
          sticky: true,
          closable: true,
        });
      } else if (response.message) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, sticky: true, closable: true });
      }

      return of(this._generalError(response, ''));
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Unknown error',
        detail: response?.error?.toString(),
        sticky: true,
        closable: true,
      });
      return of(this._generalError(response, 'Unknown error.'));
    }
  }

  _generalError(response: HttpErrorResponse, message: string) {
    return new ApiError([{ field: 'all', message: message + '  Error: ' + (response?.error?.message ?? response.message) }], false, response.status, response.statusText, response.error);
  }

  /**
   * Авторизация
   */
  login(params: any): Observable<any | ApiError> {
    return this.apiRequest('POST', `users/login`, { body: params }, false).pipe(
      tap((res: any) => {
        if (res.accessToken) {
          this.session.token$.next(res.accessToken);
          this.refreshUserInfo();
        }
      })
    );
  }

  /**
   * Забыли пароль
   */
  restorePasswordRequest(params: any): Observable<any> {
    return this.apiRequest('POST', 'users/request-reset-password', { body: params });
  }

  /**
   * Смена пароля
   */
  changePassword(params: any): Observable<any> {
    return this.apiRequest('POST', 'users/reset-password', { body: params }).pipe(
      tap((res: any) => {
        this.session.token$.next(res.accessToken);
        this.refreshUserInfo();
      })
    );
  }

  /**
   * Регистрация
   */
  signUp(params: any): Observable<User> {
    return this.apiRequest<User>('POST', 'users', { body: params }).pipe(
      tap((res) => {
        this.session.user$.next(res);
        this.session.token$.next(res.accessToken);
        this.refreshUserInfo();
      })
    );
  }

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

    return this.apiRequest('GET', 'users', { body: { params } });
  }

  /**
   * Get clients table list
   * method: POST
   * url: /users/<user id>/check-invited-users
   */
  getClientsList(userId: number = null): Observable<any> {
    if (!userId) {
      userId = this.session.user$.value.id;
    }

    return this.apiRequest('GET', `users/${userId}/invited-users`);
  }

  /**
   * Что-то связанное с партнёрской программой
   */
  checkInvitedUsers(userId: number = null): Observable<any> {
    if (!userId) {
      userId = this.sessionSerivce.user$.value.id;
    }
    return this.apiRequest('DELETE', `users/${userId}/check-invited-users`);
  }

  updateUser(value: Partial<User>): Observable<User> {
    return this.apiRequest<User>('PATCH', 'users/' + value.id, { body: value }).pipe(
      tap((result) => {
        if (!(result instanceof ApiError)) {
          this.sessionSerivce.user$.next(result);
        }
      })
    );
  }

  usersMe(): Observable<User> {
    return this.apiRequest<User>('GET', 'users/me').pipe(
      tap((result: User) => {
        console.log('usersMe result', result);
        if (result instanceof ApiError) {
          if (result.status == 401) {
            this.sessionSerivce.user$.next(null);
            this.router.navigate(['auth/signin']);
          }
        } else {
          this.sessionSerivce.user$.next(result);
        }
      })
    );
  }

  refreshUserInfo() {
    if (this.sessionSerivce.token$.value) {
      this.usersMe().subscribe((res) => {});
    }
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

    return this.apiRequest('GET', 'transactions?field=*,user.id,user.name,user.accessToken&expand=user', { body: { params } });
  }

  /**
   * Получаем пользователя по id
   */
  public getUserById(id: number) {
    return this.apiRequest('GET', `users/${id}`);
  }

  /**
   * Получаем транзакцию по id
   */
  public getTransactionById(id: number) {
    return this.apiRequest('GET', `transactions/${id}`);
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

    return this.apiRequest('GET', this.prepareTransactionsUrl(params));
  }

  /**
   * Получаем все транзакции пользователя ... вроде
   */
  private prepareTransactionsUrl(params: any = {}): string {
    let url = 'transactions/index';
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
    const params: any = { userId: this.sessionSerivce.user$.value?.id, 'per-page': this.pageSize };

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return this.apiRequest('GET', this.prepareTransactionsUrl(params));
  }

  /**
   * Operations filtered by user and isPartner flag
   * method: GET
   * url: /transactions/index?filter[userId]=<user id>&filter[isPartner]=1
   */
  getUserPartnersTransactionsList(page = 0, sort = {}): Observable<any> {
    const params: any = { userId: this.sessionSerivce.user$.value?.id, isPartner: 1, 'per-page': this.pageSize };

    if (Object.keys(sort).length > 0) {
      params.sort = this.prepareSort(sort);
    }

    if (page > 0) {
      params.page = page - 1;
    }

    return this.apiRequest('GET', this.prepareTransactionsUrl(params));
  }

  /**
   * Создаём транзакцию
   */
  createTransaction(data: any): Observable<any> {
    return this.apiRequest('POST', 'transactions/create', { body: data });
  }

  /**
   * Обновляем транзакцию
   */
  updateTransaction(data: any): Observable<any> {
    return this.apiRequest('PATCH', 'transactions/' + data.id, { body: data });
  }

  /**
   * Получение всех категорий
   */
  getCategories(): Observable<any> {
    return this.apiRequest('GET', 'categories');
  }

  /**
   * Получение всех категорий с пагинацией
   */
  getAllCategories(queryData: Record<string, string> | string = {}): Observable<CategoryArray> {
    if (typeof queryData == 'string') {
      queryData += '&expand=parentCategory';
    } else {
      if (!queryData['expand']) {
        queryData['expand'] = 'parentCategory';
      }
    }

    return this.apiRequest<CategoryArray>('GET', 'categories/index?' + new URLSearchParams(queryData).toString());
  }

  /**
   * Создаём категорию
   */
  createCategory(data: Category): Observable<any> {
    return this.apiRequest('POST', 'categories/create', { body: data });
  }

  /**
   * Получаем определённую категорию
   *
   * @param id
   */
  getCategoryById(id: number): Observable<any> {
    return this.apiRequest('GET', `categories/${id}`);
  }

  /**
   * Изменяем категорию
   */
  updateCategory(data: Category): Observable<any> {
    return this.apiRequest('PATCH', 'categories/' + data.id, { body: data });
  }

  /**
   * Удаляем определённую категорию
   *
   * @param id
   */
  deleteCategory(id: number): Observable<any> {
    return this.apiRequest('DELETE', `categories/${id}`);
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
    let query = '';
    if (data !== '') {
      query = '?' + data;
    }

    return this.apiRequest('GET', 'contents/index' + query);
  }

  /**
   * Создаём материал
   */
  createMaterials(data: Content): Observable<any> {
    return this.apiRequest('POST', 'contents/create', { body: data });
  }

  /**
   * Изменяем материал
   */
  updateMaterials(data: Content): Observable<any> {
    return this.apiRequest('PATCH', 'contents/' + data.id, { body: data });
  }

  /**
   * Удаляем определённый материал
   *
   * @param id
   */
  deleteMaterial(id: number): Observable<any> {
    return this.apiRequest('DELETE', `contents/${id}`);
  }

  /**
   * Получаем все доступные языки
   */
  getAllLanguage(): Observable<any> {
    return this.apiRequest('GET', 'languages/all');
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
    let query = '';
    if (data !== '') {
      query = '?' + data;
    }
    query += '&expand=dictionaryWord,mnemonic';

    return this.apiRequest('GET', 'dictionaries/all' + query);
  }

  /**
   * Получаем связанные слова с кандзи
   */
  getQueryUserDictionary(data: any): Observable<any> {
    let query = '';
    if (data !== '') {
      query = '?' + data;
    }
    query += '&expand=dictionaryWord,mnemonicsUsers';

    return this.apiRequest('GET', 'dictionaries/query-one' + query);
  }

  /**
   * Изменяем слова из пользовательского словаря
   */
  updateUserDictionary(data: UserDictionary): Observable<any> {
    return this.apiRequest('PATCH', 'dictionaries/' + data.id, { body: data });
  }

  /**
   * Удаляем выделенные элементы(слова или иероглифы)
   *
   * @param ids
   */
  deleteUserDictionaries(ids: number[]): Observable<any> {
    return this.apiRequest('POST', 'dictionaries/delete-select', { body: ids });
  }

  /**
   * Удаляем выделенный элемент(слово или иероглиф)
   *
   * @param id
   */
  deleteUserDictionary(id: number): Observable<any> {
    return this.apiRequest('DELETE', `dictionaries/${id}`);
  }

  /**
   * Отправляем email(Обратная связь)
   */
  sendMessage(data: any) {
    const headers = this.getSimpleLanguageHeader();
    return this.apiRequest('POST', 'users/contact', { body: data });
  }

  /**
   * Получаем язык приложения
   */
  private getSimpleLanguageHeader(): HttpHeaders {
    const lang = this.session.lang$.value;
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
    return null;
    // return this.getMeRequest(observer, token, false);;
  }

  /**
   * Вроде закрываем уведомление
   */
  onCloseNotify(data) {
    return this.apiRequest('POST', 'users/close-notification', { body: data });
  }

  /**
   * Получаем мнемоники
   */
  getMnemonics(data): Observable<any> {
    let query = '';
    if (data !== '') {
      query = '?' + data;
    }
    query += '&expand=mnemonicsUsers';

    return this.apiRequest('GET', 'mnemonics/index' + query);
  }

  /**
   * Создаём мнемонику
   */
  createMnemonic(data): Observable<any> {
    return this.apiRequest('POST', 'mnemonics/create', { body: data });
  }

  /**
   * Обновляем мнемонику
   */
  updateMnemonic(data: Mnemonic): Observable<any> {
    return this.apiRequest('PATCH', 'mnemonics/' + data.id, { body: data });
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
