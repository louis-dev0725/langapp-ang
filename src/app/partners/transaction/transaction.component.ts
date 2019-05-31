import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {SessionService} from '@app/services/session.service';
import {PaymentsTableComponent} from '@app/common/payments-table/payments-table.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  rows: any;

  @ViewChild(PaymentsTableComponent) paymentTable: PaymentsTableComponent;

  get parnterBalance(): number {
    return this.session.user.balancePartner;
  }

  constructor(private api: ApiService, private session: SessionService) { }

  ngOnInit() {
    this.paymentTable.isLoaded = false;
    this.api.getUserPartnersTransactionsList().subscribe((result) => {
      this.rows = result.items;
      this.paymentTable.isLoaded = true;
    })
  }

}
