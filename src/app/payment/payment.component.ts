import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {Router, UrlSerializer} from '@angular/router';
import {CustomValidator} from '../services/custom-validator';
import {ApiError} from '../services/api-error';
import {SessionService} from '@app/services/session.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  private minVal = 100;

  paymentForm: FormGroup;

  rows: any;

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private router: Router,
    private serializer: UrlSerializer,
    private session: SessionService) {

  }

  ngOnInit() {
    this.paymentForm = new FormGroup({
      amount: new FormControl('', {validators: [Validators.required, Validators.min(100)], updateOn: 'change'})
    });

    this.api.getUserTransactionsList().subscribe((res) => {
      if (!(res instanceof ApiError)) {
        this.rows = res.items;
      }
    });
  }

  getError() {
    const key = Object.keys(this.paymentForm.get('amount').errors);
    return (key) ? this.customValidator[key[0]] + ` ${this.minVal} ` : '';
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
    // console.log(this.serializer.serialize(urlTree));
    window.open(this.api.apiHost + this.serializer.serialize(urlTree), '_blank');
  }
}
