import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {

  }

  getError() {

  }

  paymentError() {

  }
}
