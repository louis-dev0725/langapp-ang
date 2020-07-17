import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { Router, UrlSerializer } from '@angular/router';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';
import { PaymentsTableComponent } from '@app/common/payments-table/payments-table.component';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  private minVal = 100;

  paymentForm: FormGroup;

  rows: any;

  @ViewChild(PaymentsTableComponent, { static: true }) paymentsTable: PaymentsTableComponent;

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private router: Router,
    private serializer: UrlSerializer,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.paymentsTable.isLoaded = false;

    this.paymentsTable.tableEvents
    .pipe(untilDestroyed(this))
    .subscribe((res: any) => {
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
      amount: new FormControl('', { validators: [Validators.required, Validators.min(100)], updateOn: 'change' })
    });

    this.getRows();
  }

  ngOnDestroy(): void {}

  getRows(page = 0, sort = {}) {
    this.api.getUserTransactionsList(page, sort)
    .pipe(untilDestroyed(this))
      .subscribe(res => {
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
    return key ? this.customValidator.errorMap[key[0]] + ` ${this.minVal} ` : '';
  }

  onPayment() {
    const user = this.session.user;
    const urlTree = this.router.createUrlTree(['/pay/start'], {
      queryParams: {
        email: user.email,
        userId: user.id,
        amount: this.paymentForm.get('amount').value
      }
    });
    const childWindow = window.open(this.api.apiHost + this.serializer.serialize(urlTree), '_blank');
    const interval = setInterval(() => {
      if (childWindow.closed) {
        clearInterval(interval);
        this.updateUser();
      }
    }, 1000);
  }

  updateUser() {
    this.api.meRequest()
    .pipe(untilDestroyed(this))
    .subscribe((res) => {
      this.session.changingUser.emit(res);
    });
  }
}
