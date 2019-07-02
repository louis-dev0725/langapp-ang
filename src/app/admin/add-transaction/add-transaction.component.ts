import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/services/api.service';
import {SessionService} from '@app/services/session.service';
import {EventService} from '@app/event.service';
import {CustomValidator} from '@app/services/custom-validator';
import {MatSnackBar} from '@angular/material';
import {Transaction, User} from '@app/interfaces/common.interface';
import {ApiError} from '@app/services/api-error';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {
  private _user: User;
  get user(): User {
    return this._user;
  }
  set user(val: User) {
    this._user = val;
    this.transaction.userId = val.id;
  }
  errors: any = [];
  transactionForm: FormGroup;

  transaction: Transaction = {
    userId: 0,
    comment: '',
    isPartner: 0,
    money: 0
  };

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private router: Router,
    private session: SessionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.transactionForm = this.formBuilder.group({
      userId: [this.transaction.userId || '', {validators: [Validators.required]}],
      money: [this.transaction.money || '', {validators: [Validators.required], updateOn: 'change'}],
      comment: [this.transaction.comment || ''],
      isPartner: [this.transaction.isPartner || '']
    });

    this.user = this.session.userToEdit;
  }

  checkError(fieldName: string) {
    return !this.transactionForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.transactionForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.customValidator.errorMap[key]) ? this.customValidator.errorMap[key] : '';
  }

  onCreateTransaction() {
    this.api.createTransaction(this.transactionForm.value)
      .subscribe((res) => {
        if (! (res instanceof ApiError)) {
          this.snackBar.open('Transaction created', null, {duration: 3000} );
          setTimeout(() => {
            this.router.navigate(['/admin/user']);
          }, 3100)
        } else {
          this.errors = res.error;
        }
        this.transactionForm.reset();
        this.transactionForm.get('userId').setValue(this.user.id);
      });
  }
}
