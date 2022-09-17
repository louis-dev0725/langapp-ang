import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { Router, UrlSerializer } from '@angular/router';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';
import { PaymentsTableComponent } from '@app/common/payments-table/payments-table.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User, UserPaymentMethod } from '@app/interfaces/common.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private minVal = 100;

  enableBalanceTopup = false;
  showPaymentMethods = true;
  enableSquare = false;
  enableStripe = true;

  tryingToProlong = false;

  paymentForm: FormGroup;

  rows: any;

  user: User;

  paymentMethods: UserPaymentMethod[];

  @ViewChild(PaymentsTableComponent, { static: true }) paymentsTable: PaymentsTableComponent;

  constructor(private api: ApiService, private customValidator: CustomValidator, private router: Router, private serializer: UrlSerializer, public session: SessionService, private userService: UserService, private messageService: MessageService, private translateService: TranslateService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((u) => {
      this.user = u;
    });

    if (this.paymentsTable) {
      this.paymentsTable.isLoaded = false;

      this.paymentsTable.tableEvents.pipe(untilDestroyed(this)).subscribe((res: any) => {
        this.paymentsTable.isLoaded = false;
        this.paymentsTable.rows = [];
        if (res.type === 'page') {
          this.getRows(res.data.pageIndex);
        }
        if (res.type === 'sort') {
          this.getRows(0, res.data);
        }
      });
    }

    this.paymentForm = new FormGroup({
      amount: new FormControl('', { validators: [Validators.required, Validators.min(100)], updateOn: 'change' }),
    });

    this.getRows();

    this.refreshPaymentMethods();
  }

  refreshPaymentMethods() {
    this.api.getUserPaymentMethods().subscribe((r) => {
      this.paymentMethods = r;
    });
  }

  receiveUpdatedPaymentMethods(updatedList: UserPaymentMethod[]) {
    this.paymentMethods = updatedList;
    this.tryProlongIfNeed();
  }

  prolongSubscription() {
    this.tryingToProlong = true;
    this.api.prolongSubscription().subscribe((r) => {
      this.messageService.add({ severity: r.status ? 'success' : 'error', summary: r.status ? 'Success' : 'Error', detail: r.message });
      if (r.user) {
        this.userService.user$.next(r.user);
        this.tryingToProlong = false;
      }
      if (r.status) {
        // this.updateUser();
        this.getRows();
        this.refreshPaymentMethods();
      }
    });
  }

  tryProlongIfNeed() {
    if (!this.tryingToProlong && this.paymentMethods && this.paymentMethods.length > 0 && !this.user?.isPaid) {
      this.prolongSubscription();
    }
  }

  deletePaymentMethod(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: this.translateService.instant('Are you sure you want to delete this payment method?'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deletePaymentMethod(id).subscribe((r) => {
          this.paymentMethods = r;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.translateService.instant('Payment method was deleted'),
          });
        });
      },
      reject: () => {},
    });
  }

  updateIsPaused(event: Event) {
    let newIsServicePaused = !this.user.isServicePaused ? 1 : 0;
    let message: string;
    let icon: string;
    if (this.user.isServicePaused) {
      message = this.translateService.instant('Do you want to enable subscription?');
      if (!this.user.isPaid) {
        message += ' ' + this.translateService.instant('We will charge the subscription fee for the next month according to your tariff plan.');
      }
      icon = 'pi pi-info-circle';
    } else {
      message = this.translateService.instant('Are you sure you want to disable subscription?');
      icon = 'pi pi-exclamation-triangle';
    }
    this.confirmationService.confirm({
      target: event.target,
      message: message,
      icon: icon,
      accept: () => {
        this.changeIsServicePaused(newIsServicePaused);
      },
      reject: () => {},
    });
  }

  changeIsServicePaused(newIsServicePaused: number) {
    this.api.updateUser({ id: this.user.id, isServicePaused: newIsServicePaused }).subscribe((r) => {
      this.userService.user$.next(r);
      const text = this.translateService.instant(r.isServicePaused ? 'Subscription disabled.' : 'Subscription enabled.');
      this.messageService.add({
        severity: r.isServicePaused ? 'info' : 'success',
        summary: text,
        detail: text,
      });
    });
  }

  ngOnDestroy(): void {}

  getRows(page = 0, sort = {}) {
    this.api
      .getUserTransactionsList(page, sort)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.rows = res.items;
          if (this.paymentsTable) {
            this.paymentsTable.isLoaded = true;
            this.paymentsTable.paginator.length = res._meta.totalCount;
            this.paymentsTable.paginator.pageIndex = res._meta.currentPage - 1;
          }
        }
      });
  }

  getError() {
    const key = Object.keys(this.paymentForm.get('amount').errors);
    return key ? this.customValidator.errorMap[key[0]] + ` ${this.minVal} ` : '';
  }

  onPayment() {
    const user = this.user;
    const urlTree = this.router.createUrlTree(['/pay/start'], {
      queryParams: {
        email: user?.email,
        userId: user?.id,
        amount: this.paymentForm.get('amount').value,
      },
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
    this.api.usersMe().subscribe((res) => {});
  }
}
