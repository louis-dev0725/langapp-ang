import { Component, OnInit } from '@angular/core';
import { Transaction } from '@app/interfaces/common.interface';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { TranslatingService } from "@app/services/translating.service";
import { UtilsService } from "@app/services/utils.service";

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
    private translatingService: TranslatingService,
    private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private session: SessionService,
    private snackBar: MatSnackBar,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    this.transaction = this.session.transaction;
    this.transactionForm = this.formBuilder.group({
      id: [this.transaction.id || ''],
      userId: [this.transaction.userId || ''],
      money: [this.utilsService.convertValue(this.transaction.money) || 0, {validators: [Validators.required], updateOn: 'change'}],
      comment: [this.transaction.comment || ''],
      isCommon: [this.transaction.isCommon || ''],
      isPartner: [this.transaction.isPartner || ''],
      isRealMoney: [this.transaction.isRealMoney || ''],
      fromInvitedUserId: [this.transaction['fromInvitedUserId'] || ''],
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
    const data = {
      ...this.transactionForm.value,
      isCommon: this.transactionForm.value.isCommon ? 1 : 0,
      isPartner: this.transactionForm.value.isPartner ? 1 : 0,
      isRealMoney: this.transactionForm.value.isRealMoney ? 1 : 0
    };
    this.api.updateTransaction(data).subscribe((res) => {
      if (res instanceof ApiError) {
        this.errors = res.error;
      } else {
        this.snackBar.open(this.translatingService.translates['Saved'])
      }
    })
  }
}
