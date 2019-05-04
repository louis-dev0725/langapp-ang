import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  rows: any;

  get parnterBalance(): number {
    return this.api.user.balancePartner;
  }

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getUserPartnersTransactionsList().subscribe((result) => {
      this.rows = result.items;
    })
  }

}
