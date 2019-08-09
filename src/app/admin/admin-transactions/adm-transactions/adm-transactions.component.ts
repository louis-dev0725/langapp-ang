import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { ApiService } from '@app/services/api.service';
import { EventService } from '@app/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '@app/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiError } from '@app/services/api-error';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { availableCurrencyList } from '@app/config/availableCurrencyList';

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
export class AdmTransactionsComponent implements OnInit {
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

  globalEventSubscription: any;

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

    this.globalEventSubscription = this.eventService.emitter.subscribe(event => {
      if (event.type === 'language-change') {
        this.translatePage();
      }
    });

    this.fieldKeys = Object.keys(this.translatedKeys);

    this.sort.sortChange.subscribe(data => {
      this.getTransactions();
    });

    this.getTransactions();
  }

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

    this.transactionsSubscription = this.api.getTransactions(this.paginator.page, filterValue, sort).subscribe(result => {
      this.isLoaded = true;
      if (!(result instanceof ApiError)) {
        this.rows = result.items.map(el => {
          const _mark = availableCurrencyList.find((item: any) => {
            return item.label == el.currency;
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
    this.api.getUserByToken(row.token).subscribe(result => {
      if (!(result instanceof ApiError)) {
        this.router.navigate([`../../users/${row.user.id}`], { relativeTo: this.route });
      }
    });
  }

  translatePage() {
    this.adapter.setLocale(this.session.lang);

    this.translate.get(Object.keys(this.translatedKeys)).subscribe((res: any) => {
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
