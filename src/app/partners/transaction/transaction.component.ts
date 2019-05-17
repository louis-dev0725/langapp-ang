import { Component, OnInit } from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {SessionService} from '@app/services/session.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  rows: any;

  get parnterBalance(): number {
    return this.session.user.balancePartner;
  }

  constructor(private api: ApiService, private session: SessionService) { }

  ngOnInit() {
    this.api.getUserPartnersTransactionsList().subscribe((result) => {
      this.rows = result.items;
    })
  }

}
