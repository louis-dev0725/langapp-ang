import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {Router, UrlSerializer} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../services/custom-validator';
import {TranslateService} from '@ngx-translate/core';
import {ApiError} from '../services/api-error';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  private minVal = 100;

  translatedErrorMap = CustomValidator.errorMap;

  columnNames: string[] = ['id', 'addedDateTime', 'money', 'comment'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  paymentForm: FormGroup;

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  constructor(
    private api: ApiService,
    private router: Router,
    private serializer: UrlSerializer,
    private translate: TranslateService) {

  }

  ngOnInit() {
    this.paymentForm = new FormGroup({
      amount: new FormControl('', {validators: [Validators.required, Validators.min(100)], updateOn: 'change'})
    });

    this.api.getUserTransactionsList().subscribe((res) => {
      if (!(res instanceof ApiError)) {
        const operations = res.items;
        this.dataSource = new MatTableDataSource(operations);
      }
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getError() {
    const key = Object.keys(this.paymentForm.get('amount').errors);
    return (key) ? this.translatedErrorMap[key[0]] + ` ${this.minVal} ` : '';
  }

  onPayment() {
    const user = this.api.user;
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
