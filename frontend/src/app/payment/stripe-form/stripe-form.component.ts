import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserPaymentMethod } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { SetupIntent, StripeElementsOptions, StripeError } from '@stripe/stripe-js';
import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import { MessageService } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'app-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.scss'],
})
export class StripeFormComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  elementsOptions: StripeElementsOptions = {};

  buttonEnabled = true;

  @Output() updatedListEvent = new EventEmitter<UserPaymentMethod[]>();

  constructor(private api: ApiService, private stripeService: StripeService, private messageService: MessageService, private translateService: TranslateService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initSetupIntent();

    if (this.route.snapshot.queryParams['setup_intent_client_secret']) {
      this.stripeService
        .retrieveSetupIntent(this.route.snapshot.queryParams['setup_intent_client_secret'])
        .pipe(untilDestroyed(this))
        .subscribe((result) => {
          this.checkSetupResult(result);
        });
    }
  }

  initSetupIntent() {
    this.elementsOptions.clientSecret = '';

    this.api
      .getStripeSetupIntent()
      .pipe(untilDestroyed(this))
      .subscribe((r) => (this.elementsOptions.clientSecret = r.client_secret));
  }

  async handlePaymentMethodSubmission(event: MouseEvent) {
    event.preventDefault();
    this.buttonEnabled = false;

    this.stripeService
      .confirmSetup({
        elements: this.paymentElement.elements,
        confirmParams: {
          return_url: document.location.href,
        },
        redirect: 'if_required',
      })
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.buttonEnabled = true;
        this.checkSetupResult(result);
      });
  }

  async checkSetupResult(result: { setupIntent?: SetupIntent; error?: StripeError }) {
    console.log('checkSetupResult', result);
    if (result.error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message });
    } else {
      if (result.setupIntent.status == 'succeeded') {
        this.initSetupIntent();

        this.api
          .stripeAddPaymentMethod(<string>result.setupIntent.payment_method)
          .pipe(untilDestroyed(this))
          .subscribe((res) => {
            this.updatedListEvent.emit(res);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translateService.instant('Payment method was successfully added') });
          });
      } else if (result.setupIntent.status == 'processing') {
        this.messageService.add({ severity: 'info', summary: 'Processing payment details', detail: this.translateService.instant('Please check this page later.') });
      } else if (result.setupIntent.status == 'requires_payment_method') {
        let details = result.setupIntent?.last_setup_error?.message ? ` Error details: ${result.setupIntent?.last_setup_error?.message}` : '';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.translateService.instant('Failed to process payment details. Please try another payment method.') + details });
      } else if (result.setupIntent.status == 'requires_confirmation' || result.setupIntent.status == 'requires_action' || result.setupIntent.status == 'canceled') {
        // Ignore as it was user intent or Stripe will automatically redirect
      } else {
        console.error('Unkown setupIntent.status', result.setupIntent.status);
      }
    }
  }

  async createPayment(token: string) {
    this.api
      .addCardSquare({ nonce: token })
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.updatedListEvent.emit(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translateService.instant('Payment method was successfully added') });
        // this.reinitCardPaymentMethod();
      });
  }
}
