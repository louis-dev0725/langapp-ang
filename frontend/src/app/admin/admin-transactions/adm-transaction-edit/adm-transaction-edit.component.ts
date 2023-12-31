import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from '@app/interfaces/common.interface';
import { SessionService } from '@app/services/session.service';
import { ApiService } from '@app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { TranslatingService } from '@app/services/translating.service';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-adm-transaction-edit',
  templateUrl: './adm-transaction-edit.component.html',
  styleUrls: ['./adm-transaction-edit.component.scss'],
})
export class AdmTransactionEditComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  errors: any[] = [];
  transactionForm: UntypedFormGroup;
  transactionId;

  constructor(public session: SessionService, private translatingService: TranslatingService, private api: ApiService, private customValidator: CustomValidator, private formBuilder: UntypedFormBuilder, private snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      this.getTransaction(params.id);
    });
  }

  ngOnInit() {
    this.transactionId = +this.route.snapshot.paramMap.get('id');
    this.getTransaction(this.transactionId);
    this.transactionForm = this.formBuilder.group({
      id: [''],
      userId: [''],
      money: ['', { validators: [Validators.required] }],
      comment: [''],
      isPartner: [''],
      isRealMoney: [''],
      fromInvitedUserId: [''],
    });
  }

  ngOnDestroy(): void {}

  getTransaction(id: number) {
    return this.api
      .getTransactionById(id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res: any) => {
          this.transaction = res;
          this.updateForm(res);
        },
        (err) => {}
      );
  }

  updateForm(res) {
    this.transactionForm.patchValue({
      id: res.id,
      ...res,
    });
  }

  checkError(fieldName: string) {
    return !this.transactionForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.transactionForm, fieldName);
  }

  onTransactionSave() {
    const data = {
      ...this.transactionForm.value,
      isCommon: this.transactionForm.value.isCommon ? 1 : 0,
      isPartner: this.transactionForm.value.isPartner ? 1 : 0,
      isRealMoney: this.transactionForm.value.isRealMoney ? 1 : 0,
    };
    this.api
      .updateTransaction(data)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (res instanceof ApiError) {
          this.errors = res.error;
        } else {
          this.snackBar.open(this.translatingService.translates['Saved']);
        }
      });
  }
}
