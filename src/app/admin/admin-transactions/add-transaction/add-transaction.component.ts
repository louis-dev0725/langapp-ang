import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { SessionService } from '@app/services/session.service';
import { EventService } from '@app/event.service';
import { CustomValidator } from '@app/services/custom-validator';
import { MatSnackBar } from '@angular/material';
import { Transaction, User } from '@app/interfaces/common.interface';
import { ApiError } from '@app/services/api-error';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatingService } from "@app/services/translating.service";

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
    public session: SessionService,
    private api: ApiService,
    private customValidator: CustomValidator,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private translatingService: TranslatingService
  ) {
  }

  ngOnInit() {
    this.user = this.session.userToEdit;

    this.transactionForm = this.formBuilder.group({
      userId: [this.user.id || '', {validators: [Validators.required]}],
      money: ['', {validators: [Validators.required]}],
      comment: [''],
      isPartner: [''],
      isRealMoney: ['']
    });
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
    const data = {
      ...this.transactionForm.value,
      isPartner: this.transactionForm.value.isPartner ? 1: 0
    };
    this.api.createTransaction(data)
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translatingService.translates['confirm'].transaction.created, null, {duration: 3000});
          setTimeout(() => {
            this.router.navigate([`/admin/users/${this.user.id}`]);
          }, 3100)
        } else {
          this.errors = res.error;
        }
        this.transactionForm.reset();
        this.transactionForm.get('userId').setValue(this.user.id);
      });
  }
}
