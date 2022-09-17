import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '@app/services/api.service';
import { EventService } from '@app/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { availableCurrencyList } from '@app/config/availableCurrencyList';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@UntilDestroy()
@Component({
  selector: 'app-adm-transactions',
  templateUrl: './adm-transactions.component.html',
  styleUrls: ['./adm-transactions.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class AdmTransactionsComponent implements OnInit, OnDestroy {
  private transactionsSubscription: Subscription;
  private sendTimeout;

  transactionList: any = {};
  fieldKeys: any;
  translatedKeys: any = {
    id: 'Id',
    userId: 'User Id',
    money: 'Money',
    addedDateTime: 'Added date time',
    comment: 'Comment'
  };
  columns = ['id', 'user', 'money', 'currency', 'amount in', 'comment', 'addedDateTime', 'isPartner', 'edit'];
  isLoaded = false;
  isEmptyTable = true;

  filter: any = {
    id: '',
    userId: '',
    money: '',
    currency: '',
    baseCurrency: '',
    addedDateTime: '',
    name: '',
    comment: ''
  };

  set rows(data: any[]) {
    this.isEmptyTable = data ? data.length === 0 : true;
    this.transactionList = data;
    this.transactionList.sort = this.sort;
    this.transactionList.paginator = this.paginator;
  }

  @ViewChild(MatPaginator, { static: true }) paginator;
  @ViewChild(MatSort, { static: true }) sort;
  constructor(
    public session: SessionService,
    private adapter: DateAdapter<any>,
    private api: ApiService,
    private eventService: EventService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  isFilterShown = false;

  ngOnInit() {
    this.translatePage();

    this.eventService.emitter
    .pipe(untilDestroyed(this))
    .subscribe(event => {
      if (event.type === 'language-change') {
        this.translatePage();
      }
    });

    this.fieldKeys = Object.keys(this.translatedKeys);

    this.sort.sortChange
    .pipe(untilDestroyed(this))
    .subscribe(data => {
      this.getTransactions();
    });

    this.getTransactions();
  }

  ngOnDestroy() {}

  onPageChange(event: PageEvent) {
    this.getTransactions();
  }

  isDate(fieldName: string) {
    return ['addedDateTime'].indexOf(fieldName) >= 0;
  }

  runFilter() {
    if (this.sendTimeout) {
      clearTimeout(this.sendTimeout);
    }
    this.sendTimeout = setTimeout(() => {
      this.getTransactions();
    }, 300);
  }

  getIsPartner(row: any): string {
    return '';
  }

  getTransactions(): void {
    this.isLoaded = false;
    this.rows = [];
    const sort: any = {};
    if (this.sort.direction !== '') {
      sort[this.sort.active] = this.sort.direction;
    }
    if (this.transactionsSubscription) {
      this.transactionsSubscription.unsubscribe();
    }

    const filterValue = Object.assign({}, this.filter);

    Object.keys(filterValue).forEach(key => {
      if (filterValue[key] === '') {
        delete filterValue[key];
      }
    });

    this.transactionsSubscription = this.api.getTransactions(this.paginator.page, filterValue, sort)
    .pipe(untilDestroyed(this))
    .subscribe(result => {
      this.isLoaded = true;
      if (!(result instanceof ApiError)) {
        this.rows = result.items.map(el => {
          const _mark = availableCurrencyList.find((item: any) => {
            return item.label === el.currency;
          }).value;
          return {
            ...el,
            currencyMark: _mark
          };
        });
        this.paginator.length = result._meta.totalCount;
        this.paginator.pageIndex = result._meta.currentPage - 1;
      }
    });
  }

  showEditUser(row: any) {
    // TODO: should edit from admin, not from user
    this.api.getUserByToken(row.token)
    .pipe(untilDestroyed(this))
    .subscribe(result => {
      if (!(result instanceof ApiError)) {
        this.router.navigate([`../../users/${row.user.id}`], { relativeTo: this.route });
      }
    });
  }

  translatePage() {
    this.adapter.setLocale(this.session.language);

    this.translate.get(Object.keys(this.translatedKeys))
    .pipe(untilDestroyed(this))
    .subscribe((res: any) => {
      this.translatedKeys = res;
    });
  }

  changeDate(data: any) {
    this.filter.addedDateTime = data ? data.format('YYYY-MM-DD') : '';
    this.runFilter();
  }

  clearFilter() {
    Object.keys(this.translatedKeys).map(key => {
      this.filter[key] = '';
    });
    this.runFilter();
  }
}
