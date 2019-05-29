import { Component, OnInit } from '@angular/core';
import {Transaction} from '@app/interfaces/common.interface';
import {SessionService} from '@app/services/session.service';
import {ApiService} from '@app/services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {CustomValidator} from '@app/services/custom-validator';
import {ApiError} from '@app/services/api-error';

@Component({
  selector: 'app-adm-transaction-edit',
  templateUrl: './adm-transaction-edit.component.html',
  styleUrls: ['./adm-transaction-edit.component.scss']
})
export class AdmTransactionEditComponent implements OnInit {
  transaction: Transaction;
  errors: any[] = [];
  transactionForm: FormGroup;

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private session: SessionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.transaction = this.session.transaction;
    this.transactionForm = this.formBuilder.group({
      id: [''],
      userId:[''],
      money:['', {validators: [Validators.required], updateOn: 'change'}],
      comment: [''],
      isCommon: [''],
      isPartner: [''],
      isRealMoney: [''],
      fromInvitedUserId:[''],
    })
  }

  checkError(fieldName: string) {
    return !this.transactionForm.get(fieldName).valid
  }

  getError(fieldName: string) {
    const errors = this.transactionForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.customValidator.errorMap[key]) ? this.customValidator.errorMap[key] : '';
  }

  onTransactionSave() {
    this.api.updateTransaction(this.transactionForm.value).subscribe((res) => {
      if (res instanceof ApiError) {
        this.errors = res.error;
      } else {
        this.snackBar.open('Saved')
      }
    })
  }
}
