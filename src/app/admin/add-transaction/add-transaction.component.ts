import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/services/api.service';
import {SessionService} from '@app/services/session.service';
import {EventService} from '@app/event.service';
import {CustomValidator} from '@app/services/custom-validator';
import {MatSnackBar} from '@angular/material';
import {Transaction, User} from '@app/interfaces/common.interface';

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
    console.log('user', val);
    this._user = val;
    this.transaction.userId = val.id;
  }
  errors: any = [];
  transactionForm: FormGroup;

  transaction: Transaction = {
    userId: 0,
    comment: '',
    isPartner: false,
    money: 0
  };

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private session: SessionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.transactionForm = this.formBuilder.group({
      userId: ['', {validatore: [Validators.required]}],
      money: ['', {validators: [Validators.required], updateOn: 'change'}],
      comment: [''],
      isParnter: ['']
    });

    this.user = this.session.userToEdit;
  }

  checkError(fieldName: string) {

  }

  getError(fieldName: string) {

  }

  onCreateTransaction() {
    console.log(this.transactionForm.value);
  }
}
