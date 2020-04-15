import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { PaymentsTableComponent } from '@app/common/payments-table/payments-table.component';
import { ApiError } from '@app/services/api-error';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit, OnDestroy {

  rows: any;

  @ViewChild(PaymentsTableComponent, { static: true }) paymentTable: PaymentsTableComponent;

  get parnterBalance(): number {
    return this.session.user.balancePartner;
  }

  constructor(public session: SessionService, private api: ApiService) {}

  ngOnInit() {
    this.getTransactions();

    this.paymentTable.tableEvents
    .pipe(untilDestroyed(this))
    .subscribe(event => {
      if (event.type === 'page') {
        this.getTransactions(event.data.pageIndex);
      }
      if (event.type === 'sort') {
        this.getTransactions(0, event.data);
      }
    });
  }

  ngOnDestroy(): void { }

  getTransactions(page = 0, sort = {}) {
    this.rows = [];
    this.paymentTable.isLoaded = false;
    this.api.getUserPartnersTransactionsList(page, sort).pipe(untilDestroyed(this)).subscribe(result => {
      if (!(result instanceof ApiError)) {
        this.rows = result.items;
        this.paymentTable.isLoaded = true;
        this.paymentTable.paginator.length = result._meta.totalCount;
        this.paymentTable.paginator.pageIndex = result._meta.currentPage - 1;
      }
    });
  }
}
