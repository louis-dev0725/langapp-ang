import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '@app/services/api.service';
import {EventService} from '@app/event.service';
import {Router} from '@angular/router';
import {SessionService} from '@app/services/session.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {ApiError} from '@app/services/api-error';

@Component({
  selector: 'app-adm-transactions',
  templateUrl: './adm-transactions.component.html',
  styleUrls: ['./adm-transactions.component.scss']
})
export class AdmTransactionsComponent implements OnInit {

  private transactionsSubscription: Subscription;
  private sendTimeout;

  transactionList: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  fieldKeys: any;
  filter: any;
  translatedKeys: any;
  columns = ['id', 'user', 'money', 'comment', 'addedDateTime', 'isPartner', 'edit'];
  isLoaded = false;
  isEmptyTable = true;

  set rows(data: any[]) {
    this.isEmptyTable = (data) ? data.length === 0 : true;
    this.transactionList = new MatTableDataSource(data);
  }

  @ViewChild(MatPaginator) paginator;
  @ViewChild(MatSort) sort;

  constructor(
    private api: ApiService,
    private eventService: EventService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private session: SessionService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.sort.sortChange.subscribe((data) => {
      this.getTransactions();
    });

    this.getTransactions();
  }

  isFilterField(item: any) {

  }

  runFilter() {

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

    this.transactionsSubscription = this.api.getTransactions(this.paginator.page, filterValue, sort)
      .subscribe((result) => {
        this.isLoaded = true;
        if (!(result instanceof ApiError)) {
          this.rows = result.items;
        }
      })
  }

  showEditTransaction(row: any) {
    this.session.transaction = row;
    console.log('transaction', row);
    this.router.navigate(['/admin/transaction']);
  }

  showEditUser(row: any) {
    this.api.getUserByToken(row.token).subscribe((result) => {
      if (!(result instanceof ApiError)) {
        this.session.userToEdit = this.session.tempUser;
        this.router.navigate(['/admin/user']);
      }
    })
  }
}
