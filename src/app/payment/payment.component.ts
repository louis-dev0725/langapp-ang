import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {Router, UrlSerializer} from '@angular/router';
import {CustomValidator} from '../services/custom-validator';
import {ApiError} from '../services/api-error';
import {SessionService} from '@app/services/session.service';
import {PaymentsTableComponent} from '@app/common/payments-table/payments-table.component';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  private minVal = 100;
  private tableEventsSubscription: Subscription;

  paymentForm: FormGroup;

  rows: any;

  @ViewChild(PaymentsTableComponent, {static: true}) paymentsTable: PaymentsTableComponent;

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private router: Router,
    private serializer: UrlSerializer,
    private session: SessionService) {

  }

  ngOnInit() {

    this.paymentsTable.isLoaded = false;

    this.tableEventsSubscription = this.paymentsTable.tableEvents.subscribe((res: any) => {
      this.paymentsTable.isLoaded = false;
      this.paymentsTable.rows = [];
      if (res.type === 'page') {
        this.getRows(res.data.pageIndex);
      }
      if (res.type === 'sort') {
        this.getRows(0, res.data);
      }
    });

    this.paymentForm = new FormGroup({
      amount: new FormControl('', {validators: [Validators.required, Validators.min(100)], updateOn: 'change'})
    });

    this.getRows();

  }

  ngOnDestroy(): void {
    if (this.tableEventsSubscription) {
      this.tableEventsSubscription.unsubscribe();
    }
  }

  getRows(page = 0, sort = {}) {
    this.api.getUserTransactionsList(page, sort).subscribe((res) => {
      if (!(res instanceof ApiError)) {
        this.rows = res.items;
        this.paymentsTable.isLoaded = true;
        this.paymentsTable.paginator.length = res._meta.totalCount;
        this.paymentsTable.paginator.pageIndex = res._meta.currentPage - 1;
      }
    });
  }

  getError() {
    const key = Object.keys(this.paymentForm.get('amount').errors);
    return (key) ? this.customValidator.errorMap[key[0]] + ` ${this.minVal} ` : '';
  }

  onPayment() {
    const user = this.session.user;
    const urlTree = this.router.createUrlTree(
      ['/pay/start'],
      {
        queryParams: {
          email: user.email,
          userId: user.id,
          amount: this.paymentForm.get('amount').value
        }
      });
    window.open(this.api.apiHost + this.serializer.serialize(urlTree), '_blank');
  }
}
