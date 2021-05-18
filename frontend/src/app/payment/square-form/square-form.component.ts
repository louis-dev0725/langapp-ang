import { isPlatformServer } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { ListResponse, UserPaymentMethod } from '@app/interfaces/common.interface';
import { ApiService } from '@app/services/api.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../../../environments/environment';

enum LoadingStatus {
  Initial,
  Loading,
  Loaded,
  Error
}

@UntilDestroy()
@Component({
  selector: 'app-square-form',
  templateUrl: './square-form.component.html',
  styleUrls: ['./square-form.component.scss']
})
export class SquareFormComponent implements OnInit {
  apiLoadingStatus = LoadingStatus.Initial;
  scriptUrl = '';
  applicationId = '';
  locationId = '';

  cardPaymentMethod: any;
  buttonEnabled = true;

  @ViewChild('cardContainer', { static: true }) cardContainer: ElementRef;
  @Output() updatedListEvent = new EventEmitter<UserPaymentMethod[]>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private api: ApiService) { }

  ngOnInit(): void {
    this.scriptUrl = environment.square.env == 'sandbox' ? 'https://sandbox.web.squarecdn.com/v1/square.js' : 'https://web.squarecdn.com/v1/square.js';
    this.applicationId = environment.square[environment.square.env].applicationId;
    this.locationId = environment.square[environment.square.env].locationId;

    this.loadSquareApi();
  }

  loadSquareApi() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    if (window.hasOwnProperty('Square')) {
      this.apiLoadingStatus = LoadingStatus.Loaded;
      this.onApiLoaded();
    } else if (this.apiLoadingStatus == LoadingStatus.Initial) {
      this.apiLoadingStatus = LoadingStatus.Loading;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;

      script.src = this.scriptUrl;

      script.onload = () => {
        this.apiLoadingStatus = LoadingStatus.Loaded;
        this.onApiLoaded();
      };

      script.onerror = () => {
        this.apiLoadingStatus = LoadingStatus.Error;
      };

      document.body.appendChild(script);
    }
  }

  async onApiLoaded() {
    let payments: any;
    //@ts-ignore
    payments = window.Square.payments(this.applicationId, this.locationId);

    this.cardPaymentMethod = await payments.card();
    await this.cardPaymentMethod.attach(this.cardContainer.nativeElement);
  }

  async handlePaymentMethodSubmission(event: MouseEvent) {
    event.preventDefault();
    let paymentMethod = this.cardPaymentMethod;

    try {
      // disable the submit button as we await tokenization and make a payment request.
      this.buttonEnabled = false;
      const token = await this.tokenize(paymentMethod);
      const paymentResults = await this.createPayment(token);
      //displayPaymentResults('SUCCESS');

      console.debug('Payment Success', paymentResults);
      this.buttonEnabled = true;
    } catch (e) {
      this.buttonEnabled = true;
      //displayPaymentResults('FAILURE');
      console.error(e.message);
    }
  }

  async tokenize(paymentMethod: any) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(
          tokenResult.errors
        )}`;
      }

      throw new Error(errorMessage);
    }
  }

  async createPayment(token: string) {
    this.api.addCardSquare({ nonce: token }).pipe(untilDestroyed(this)).subscribe((res) => {
      this.updatedListEvent.emit(res);
    });
  }
}
